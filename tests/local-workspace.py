#!/usr/bin/env python3
"""Integration test the opt-in local RFQ and messaging flow against a built app."""
import hashlib
import http.cookiejar
import json
import os
from pathlib import Path
import secrets
import socket
import sqlite3
import subprocess
import tempfile
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
PASSWORD = 'test-password-123'


def setup(directory):
    with sqlite3.connect(directory / 'truv.sqlite3') as db:
        db.executescript((ROOT / 'data/schema.sql').read_text())
    with sqlite3.connect(directory / 'local-auth.sqlite3') as db:
        db.execute('CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT UNIQUE, name TEXT, company TEXT, role TEXT, salt TEXT, password_hash TEXT)')
        db.execute('CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, user_id TEXT, expires_at INTEGER)')
        for ident, role in [('buyer', 'buyer'), ('factory', 'manufacturer'), ('factory2', 'manufacturer'), ('agency', 'service')]:
            salt = secrets.token_hex(16)
            hashed = hashlib.scrypt(PASSWORD.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1, dklen=64).hex()
            db.execute('INSERT INTO users VALUES (?,?,?,?,?,?,?)', (ident, ident + '@local.test', ident, ident, role, salt, hashed))


def main():
    with tempfile.TemporaryDirectory() as tmp:
        directory = Path(tmp)
        setup(directory)
        with socket.socket() as s:
            s.bind(('127.0.0.1', 0))
            port = s.getsockname()[1]
        base = f'http://127.0.0.1:{port}'
        env = {**os.environ, 'TRUV_LOCAL_WORKSPACE': '1', 'TRUV_LOCAL_DATA_DIR': tmp}
        process = subprocess.Popen(['npm', 'run', 'start', '--', '--hostname', '127.0.0.1', '--port', str(port)], cwd=ROOT, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        def client():
            return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        def call(opener, data=None):
            headers = {'Origin': base, 'Content-Type': 'application/json'} if data is not None else {}
            req = urllib.request.Request(base + '/api/local-workspace', data=json.dumps(data).encode() if data is not None else None, headers=headers)
            try:
                with opener.open(req, timeout=3) as res:
                    return res.status, json.load(res)
            except urllib.error.HTTPError as e:
                return e.code, json.load(e)
        try:
            for _ in range(100):
                try:
                    if call(client())[0] == 401:
                        break
                except (OSError, urllib.error.URLError):
                    time.sleep(.1)
            else:
                raise RuntimeError('Server did not start')
            accounts = {}
            for ident in ['buyer', 'factory', 'factory2', 'agency']:
                accounts[ident] = client()
                assert call(accounts[ident], {'action':'login','email':ident+'@local.test','password':PASSWORD})[0] == 200
            buyer, factory, factory2, agency = (accounts[k] for k in ['buyer', 'factory', 'factory2', 'agency'])
            for kind in ['goods', 'service']:
                assert call(buyer, {'action':'create_rfq','kind':kind,'title':kind+' request','description':'requirements'})[0] == 201
            goods = call(factory)[1]['rfqs'][0]['id']
            service = call(agency)[1]['rfqs'][0]['id']
            assert len(call(factory)[1]['rfqs']) == len(call(agency)[1]['rfqs']) == 1
            assert call(agency, {'action':'start_conversation','rfqId':goods,'body':'wrong type'})[0] == 404
            assert call(factory, {'action':'start_conversation','rfqId':goods,'body':'Factory message'})[0] == 201
            assert call(agency, {'action':'start_conversation','rfqId':service,'body':'Agency message'})[0] == 201
            listing = call(buyer)[1]
            assert len(listing['conversations']) == 2 and len(listing['messages']) == 2
            thread = next(c['id'] for c in listing['conversations'] if c['title'] == 'goods request')
            assert call(buyer, {'action':'send_message','conversationId':thread,'body':'Buyer reply'})[0] == 201
            assert call(factory2, {'action':'send_message','conversationId':thread,'body':'unauthorized'})[0] == 404
            assert not call(factory2)[1]['messages']
            assert [m['body'] for m in call(factory)[1]['messages']] == ['Factory message', 'Buyer reply']
            assert [m['body'] for m in call(agency)[1]['messages']] == ['Agency message']
            with sqlite3.connect(directory / 'truv.sqlite3') as db:
                assert db.execute('SELECT COUNT(*) FROM conversation_messages').fetchone()[0] == 3
                assert db.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
            print('RFQs, replies, persistence and participant isolation passed.')
        finally:
            os.killpg(process.pid, 15)
            process.wait(timeout=10)

if __name__ == '__main__':
    main()
