xcopy vendor\bootstrap dist\vendor\bootstrap /s /e /i /q
xcopy basics dist\basics /s /e /i /q
xcopy vendor\font-awesome dist\vendor\font-awesome /s /e /i /q
xcopy components\*.scss dist\components /s /e /i /q
xcopy components\*.html dist\components /s /e /i /q
xcopy vendor\primeface dist\vendor\primeface /i /q
COPY _mixins.scss dist\
COPY _ngx-stoui.scss dist\
COPY _variables.scss dist\
