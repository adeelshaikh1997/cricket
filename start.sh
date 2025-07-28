#!/bin/bash

echo "🏏 Starting Cricklytics Application..."

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Kill existing processes on ports 3000 and 5000
echo "🧹 Cleaning up existing processes..."
if check_port 3000; then
    echo "Stopping process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

if check_port 5001; then
    echo "Stopping process on port 5001..."
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
fi

# Start backend
echo "🚀 Starting Flask backend on port 5001..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start frontend
echo "🎨 Starting React frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Cricklytics is starting up!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down Cricklytics..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    
    # Kill any remaining processes on the ports
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    
    echo "👋 Goodbye!"
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait 