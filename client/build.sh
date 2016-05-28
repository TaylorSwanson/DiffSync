#!/bin/bash

browserify index.js --s DiffSync -o ./DiffSync.js

uglifyjs ./DiffSync.js -o ./DiffSyncMin.js

echo "Done -- created DiffSync.js file"
