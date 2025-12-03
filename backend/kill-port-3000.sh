#!/bin/bash
# Script to kill process using port 3000 on Windows (Git Bash)

echo "Finding process using port 3000..."

# Try using netstat (Windows)
PID=$(netstat -ano | grep :3000 | grep LISTENING | awk '{print $5}' | head -1)

if [ -z "$PID" ]; then
    echo "No process found using port 3000"
    exit 0
fi

echo "Found process: PID $PID"
echo "Killing process..."

# Kill the process
taskkill //PID $PID //F

if [ $? -eq 0 ]; then
    echo "✅ Process killed successfully"
else
    echo "❌ Failed to kill process. Try running as administrator or use Task Manager"
fi

