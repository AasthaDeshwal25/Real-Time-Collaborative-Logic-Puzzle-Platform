#!/bin/bash

echo "🚀 Setting up Collaborative Logic Puzzle Platform..."

# Backend setup
echo "📦 Setting up backend..."
cd backend
if command -v mvn &> /dev/null; then
    mvn clean install
    echo "✅ Backend dependencies installed"
else
    echo "❌ Maven not found. Please install Maven first."
    exit 1
fi

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend
if command -v npm &> /dev/null; then
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "❌ npm not found. Please install Node.js and npm first."
    exit 1
fi

cd ..

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && mvn spring-boot:run"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8080"
echo "- H2 Console: http://localhost:8080/h2-console"
