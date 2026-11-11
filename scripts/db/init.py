#!/usr/bin/env python3
"""Create the local database without overwriting existing records."""
import sqlite3
from pathlib import Path

root = Path(__file__).resolve().parents[2]
path = root / 'data' / 'truv.sqlite3'
with sqlite3.connect(path) as db:
    db.executescript((root / 'data' / 'schema.sql').read_text())
    result = db.execute('PRAGMA integrity_check').fetchone()[0]
    if result != 'ok':
        raise RuntimeError(f'Database integrity check failed: {result}')
print(f'Local database ready: {path.relative_to(root)}')
