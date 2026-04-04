#!/bin/bash
# Launch a local dev server for SIGNAL (standalone mode)
cd "$(dirname "$0")/assets"
echo "SIGNAL dev server starting at http://localhost:8749"
echo "Open http://localhost:8749/game.html to play"
python3 -m http.server 8749
