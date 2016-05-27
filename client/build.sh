#!/bin/bash

browserify ClientSession.js --s DiffSync -o ./DiffSync.js

uglifyjs ./DiffSync.js -o ./DiffSyncMin.js

echo "Done -- created DiffSync.js file"
