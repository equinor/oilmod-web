#!/bin/sh

node builder.js --project core
node builder.js --project form

projects=(core common datatable drawer form)

for i in "${projects[@]}"; do yarn test "stoui-$i"; done
