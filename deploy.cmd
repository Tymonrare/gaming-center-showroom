@echo off

set /P sh_type="Enter showroom type (xd-default for example): " %=%

del "%sh_type%.7z"

"C:\Program Files\7-Zip\7z.exe" a -t7z %sh_type%.7z -r .\%sh_type%\*

python ../GamingCenter/maintenance/deploy-new-bin.py ./%sh_type%.7z https://d3i8w87ms3cidi.cloudfront.net bin/showrooms/%sh_type%-"

