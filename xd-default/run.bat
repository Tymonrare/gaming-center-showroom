set port=8000

start /b "" python -m server.py %port%

:: cd "%LocalAppData%\Google\Chrome\Application\"
:: cd "C:\Program Files (x86)\Google\Chrome\Application\"

start /b "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --start-fullscreen --app=http://localhost:%port%
