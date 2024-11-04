@echo off
echo Stopping the application with PM2...
pm2 stop ecosystem.config.js

pause
