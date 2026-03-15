#!/bin/bash
# Start a local server to run Room Studio
# ES modules require HTTP serving (won't work with file://)
echo "Starting Room Studio at http://localhost:8080"
echo "Press Ctrl+C to stop"
python3 -m http.server 8080
