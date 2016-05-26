#!/bin/bash
touch ./otClient.js
echo "" > ./otClient.js

cat ./diff_match_patch.js       >> ./otClient.js
cat ./EventEmitter.js           >> ./otClient.js
cat ./ClientSession.js          >> ./otClient.js

echo "Done"
