#!/usr/bin/env python3
"""Provision one account for the local RFQ workflow; repeat for each role."""
import getpass
import hashlib
import secrets
import sqlite3
import sys
from pathlib import Path
root = Path(__file__).resolve().parents[2]
role = input('Role (buyer/manufacturer/service): ').strip().lower()
if role not in ('buyer', 'manufacturer', 'service'):
    sys.exit('Invalid role.')
name = input('Name: ').strip()
email = input('Email: ').strip().lower()
company = input('Company: ').strip()
password = getpass.getpass('Password (at least 12 characters): ')
if not name or not email or not company or len(password) < 12:
    sys.exit('All fields are required and password must contain at least 12 characters.')
if password != getpass.getpass('Confirm password: '):
    sys.exit('Passwords do not match.')
salt = secrets.token_hex(16)
hash_value = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1, dklen=64).hex()
auth_path = root / 'data/local-auth.sqlite3'
with sqlite3.connect(auth_path) as db:
    db.execute('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, company TEXT NOT NULL, role TEXT NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL)')
    db.execute('CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL)')
    try:
        db.execute('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)', (hashlib.sha256((role + ':' + email).encode()).hexdigest(), email, name, company, role, salt, hash_value))
    except sqlite3.IntegrityError:
        sys.exit('This email already exists.')
print('Account created. Credentials are stored locally and are not tracked by Git.')
