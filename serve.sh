#!/bin/bash
# Launch a local dev server for SIGNAL
cd "$(dirname "$0")/engine"
echo "SIGNAL dev server starting at http://localhost:8749"
python3 -m http.server 8749
