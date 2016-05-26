#!/bin/bash
touch ./OTClient.js
echo "" > ./OTClient.js

cat ./diff_match_patch.js       >> ./OTClient.js
cat ./EventEmitter.js           >> ./OTClient.js
cat ./ClientSession.js          >> ./OTClient.js

echo "Done"
