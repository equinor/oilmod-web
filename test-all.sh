#!/bin/sh

#node builder.js --project core
#node builder.js --project form

yarn test stoui-core
#yarn test stoui-common
#yarn test stoui-datatable
#yarn test stoui-form

echo "Test suite completed"
