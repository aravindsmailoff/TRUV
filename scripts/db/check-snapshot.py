#!/usr/bin/env python3
"""Verify the tracked SQLite snapshot and flag database changes not included in Git."""
import sqlite3
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
database = root / 'data' / 'truv.sqlite3'
if not database.is_file():
    sys.exit('Database missing. Run python3 scripts/db/init.py first.')
try:
    with sqlite3.connect(f'{database.as_uri()}?mode=ro', uri=True) as db:
        result = db.execute('PRAGMA integrity_check').fetchone()[0]
        if result != 'ok':
            sys.exit(f'Database integrity check failed: {result}')
except sqlite3.Error as exc:
    sys.exit(f'Cannot check database: {exc}')
status = subprocess.run(
    ['git', 'status', '--porcelain', '--', 'data/truv.sqlite3'],
    cwd=root, capture_output=True, text=True, check=True,
).stdout
if status:
    print('The database differs from the last commit:', status.strip())
    print('Stop database writers, review the data, then git add and commit it before pushing.')
    sys.exit(1)
print('Database integrity is OK and the snapshot matches the current commit.')
