#!/bin/bash

# Get More Diners - Startup Script
# This script starts both backend and frontend services

echo "🚀 Starting Get More Diners application..."

# Start backend in background
echo "📡 Starting backend server on port 3000..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend in background
echo "🌐 Starting frontend server on port 3001..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ Both services started!"
echo "📡 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
