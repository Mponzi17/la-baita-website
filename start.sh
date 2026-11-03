#!/bin/sh
# Run the La Baita site locally on macOS or Linux: ./start.sh
# Serves this folder so images, video and scroll animations all load.
cd "$(dirname "$0")" || exit 1
PORT=8765
URL="http://localhost:$PORT"

open_url() { (command -v open >/dev/null && open "$1") || (command -v xdg-open >/dev/null && xdg-open "$1") || true; }

if command -v npx >/dev/null 2>&1; then
  echo "Starting La Baita at $URL (Ctrl+C to stop)"
  (sleep 2; open_url "$URL") &
  exec npx --yes serve@14.2.4 -l "$PORT" .
elif command -v python3 >/dev/null 2>&1; then
  echo "Starting La Baita at $URL (Ctrl+C to stop)"
  (sleep 1; open_url "$URL") &
  exec python3 -m http.server "$PORT"
else
  echo "Node.js or Python not found, opening the page directly from disk instead."
  open_url "index.html"
fi
