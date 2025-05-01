@echo off
SETLOCAL

echo Cleaning npm cache...
npm cache clean --force

echo Switching to a more reliable registry (npmmirror)...
npm config set registry https://registry.npmmirror.com

echo Running Angular 18 upgrade...
npx @angular/cli@18 update @angular/core@18 @angular/cli@18 --force

IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Angular upgrade failed. Try checking your internet or proxy settings.
    GOTO END
)

echo Running npm install with retry options...
npm install --fetch-retries=5 --fetch-retry-mintimeout=2000 --fetch-retry-maxtimeout=10000

echo Switching registry back to default npm...
npm config set registry https
