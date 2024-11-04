@echo off
echo Installing dependencies...
npm install

echo Building the application...
npm run build

echo Starting the application with PM2...
pm2 start ecosystem.config.js

pause
