#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "== javascript syntax =="
node --check app.js

echo "== python syntax =="
python3 -m py_compile server.py

echo "== shell syntax =="
bash -n run.sh
bash -n scripts/preflight.sh

echo "== static asset links =="
python3 - <<'PY'
from pathlib import Path

html = Path("index.html").read_text(encoding="utf-8")
required = ["./styles.css", "./app.js", "../tariffs-2026/app-v2/data.js"]
missing = [item for item in required if item not in html]
if missing:
    raise SystemExit(f"index.html is missing required assets: {', '.join(missing)}")

for path in ["app.js", "styles.css", "server.py", "run.sh"]:
    if not Path(path).exists():
        raise SystemExit(f"missing required file: {path}")
PY

echo "== secret scan =="
python3 - <<'PY'
from __future__ import annotations

import re
from pathlib import Path

patterns = [
    re.compile(r"(?i)\b(api[_-]?key|password|secret|token)\s*=\s*['\"]?[A-Za-z0-9_./:+-]{12,}"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
]
excluded_dirs = {".git", "__pycache__", "node_modules", ".secrets", "test-artifacts"}
excluded_files = {Path("scripts/preflight.sh")}
hits: list[str] = []

for path in Path(".").rglob("*"):
    if not path.is_file():
        continue
    if any(part in excluded_dirs for part in path.parts):
        continue
    if path in excluded_files:
        continue
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    for lineno, line in enumerate(text.splitlines(), 1):
        if any(pattern.search(line) for pattern in patterns):
            hits.append(f"{path}:{lineno}")

if hits:
    print("Potential secret-like values found:")
    print("\n".join(hits))
    raise SystemExit(1)
PY

echo "krasny-yar-energo-app preflight passed"
