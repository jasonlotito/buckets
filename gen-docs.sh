#!/bin/sh

./node_modules/mocha/bin/mocha tests/bucket_tests.js  --reporter markdown >> API.md

cat ABOUT.md > README.md
cat API.md >> README.md
cat LICENSE.md >> README.md && open README.md
