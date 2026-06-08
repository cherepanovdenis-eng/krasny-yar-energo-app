#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/deniscerepanov/claude-workspace/projects"
PORT="${KYE_APP_PORT:-8797}"

cd "$ROOT"
for candidate in "$PORT" 8798 8799 8800; do
  if lsof -iTCP:"$candidate" -sTCP:LISTEN >/dev/null 2>&1; then
    if curl -fsS "http://127.0.0.1:${candidate}/krasny-yar-energo-app/api/health" >/dev/null 2>&1; then
      open "http://127.0.0.1:${candidate}/krasny-yar-energo-app/"
      echo "Красный Яр Энерго App уже запущен: http://127.0.0.1:${candidate}/krasny-yar-energo-app/"
      exit 0
    fi
    continue
  fi
  PORT="$candidate"
  break
done

python3 krasny-yar-energo-app/server.py "$PORT" >/tmp/krasny-yar-energo-app.log 2>&1 &
SERVER_PID="$!"

sleep 1
open "http://127.0.0.1:${PORT}/krasny-yar-energo-app/"

echo "Красный Яр Энерго App: http://127.0.0.1:${PORT}/krasny-yar-energo-app/"
echo "Лог сервера: /tmp/krasny-yar-energo-app.log"
echo "Для остановки закройте это окно или нажмите Ctrl+C."

trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT
wait "$SERVER_PID"
