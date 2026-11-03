@echo off
rem Double-click to run the La Baita site locally on Windows.
rem Serves this folder so images, video and scroll animations all load.
cd /d "%~dp0"
set PORT=8765

where node >nul 2>nul
if %errorlevel%==0 (
  echo Starting La Baita at http://localhost:%PORT%  ^(close this window to stop^)
  start "" http://localhost:%PORT%
  npx --yes serve@14.2.4 -l %PORT% .
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting La Baita at http://localhost:%PORT%  ^(close this window to stop^)
  start "" http://localhost:%PORT%
  python -m http.server %PORT%
  goto :eof
)

echo Node.js or Python not found, opening the page directly from disk instead.
start "" "%~dp0index.html"
