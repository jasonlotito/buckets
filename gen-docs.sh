#!/bin/sh

./node_modules/mocha/bin/mocha tests/bucket_tests.js  --reporter markdown  > README.md && open README.md
