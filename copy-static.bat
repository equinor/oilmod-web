xcopy vendor\bootstrap dist\vendor\bootstrap /s /e /i
xcopy basics dist\basics /s /e /i
xcopy vendor\font-awesome dist\vendor\font-awesome /s /e /i
xcopy components\*.scss dist\components /s /e /i
xcopy components\*.html dist\components /s /e /i
xcopy vendor\primeface dist\vendor\primeface /i
COPY _mixins.scss dist\
COPY _ngx-stoui.scss dist\
COPY _variables.scss dist\
COPY package.json dist\