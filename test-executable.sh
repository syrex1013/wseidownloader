#!/bin/bash

echo "🧪 WSEI Course Downloader Executable Test"
echo "========================================="

# Check if executable exists
if [ ! -f "dist/wsei-course-downloader-linux-x64" ]; then
    echo "❌ Error: Linux executable not found at dist/wsei-course-downloader-linux-x64"
    echo "Please run: npm run build:exe"
    exit 1
fi

echo "✅ Found executable: dist/wsei-course-downloader-linux-x64"
echo "📏 Size: $(ls -lh dist/wsei-course-downloader-linux-x64 | awk '{print $5}')"
echo "📄 Type: $(file dist/wsei-course-downloader-linux-x64)"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker found, checking if it's running..."
    if docker info &> /dev/null; then
        echo "✅ Docker is running"
        echo ""
        
        echo "Testing in Docker container..."
        echo "------------------------------"
        
        # Simple Docker test
        docker run --rm -v "$(pwd)/dist:/app" alpine:latest sh -c 'echo "Container started" && ls -la /app/wsei-course-downloader-linux-x64'
        
    else
        echo "⚠️  Docker is installed but not running"
        echo "Please start Docker Desktop and try again"
    fi
else
    echo "⚠️  Docker not found"
fi

echo ""
echo "💡 Alternative: Test directly on your system (if Linux/macOS):"
echo "-------------------------------------------------------------"
echo "cd dist"
echo "./wsei-course-downloader-linux-x64"
echo ""
echo "Or test with a specific command:"
echo "./dist/wsei-course-downloader-linux-x64 --version"
echo "./dist/wsei-course-downloader-linux-x64 --help" 