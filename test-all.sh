#!/bin/sh

node builder.js --project core
node builder.js --project form

yarn test stoui-core &
yarn test stoui-common

wait


yarn test stoui-datatable &
yarn test stoui-form
wait

echo "Test suite completed"
