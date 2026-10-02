#!/bin/sh
set -e
cd server
npm install
cd ../client
npm install
cd ..
echo "Setup complete. Configure server/.env and client/.env before starting."
