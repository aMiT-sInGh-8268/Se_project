@echo off
title Se_project Auto-Push Watcher
echo Starting auto-push watcher...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0auto-push.ps1"
pause
