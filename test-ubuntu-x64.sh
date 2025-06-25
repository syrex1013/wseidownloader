#!/bin/bash

echo "🐳 Testing WSEI Linux x64 Executable in Ubuntu Docker"
echo "===================================================="

# Check if executable exists
if [ ! -f "dist/wsei-course-downloader-linux-x64" ]; then
    echo "❌ Error: Linux executable not found"
    echo "Please run: npm run build:exe"
    exit 1
fi

echo "✅ Found executable: dist/wsei-course-downloader-linux-x64"
echo "📏 Size: $(ls -lh dist/wsei-course-downloader-linux-x64 | awk '{print $5}')"
echo ""

echo "🚀 Starting Ubuntu 22.04 x64 container..."
echo "----------------------------------------"

# Run in Ubuntu with detailed output
docker run --rm \
    --platform linux/amd64 \
    -v "$(pwd)/dist:/app" \
    -v "$(pwd)/config.example.json:/app/config.json" \
    -e "DEBIAN_FRONTEND=noninteractive" \
    ubuntu:22.04 \
    bash -c '
        echo "=== Container Environment ==="
        echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)"
        echo "Architecture: $(uname -m)"
        echo "Kernel: $(uname -r)"
        echo ""
        
        echo "=== Checking for Node.js/Chrome ==="
        echo "Node.js: $(which node 2>/dev/null || echo "NOT INSTALLED ✓")"
        echo "Chrome: $(which google-chrome 2>/dev/null || echo "NOT INSTALLED ✓")"
        echo "Chromium: $(which chromium 2>/dev/null || echo "NOT INSTALLED ✓")"
        echo ""
        
        echo "=== Executable Information ==="
        cd /app
        ls -la wsei-course-downloader-linux-x64
        file wsei-course-downloader-linux-x64
        echo ""
        
        echo "=== Library Dependencies ==="
        ldd wsei-course-downloader-linux-x64 || echo "Cannot check dependencies"
        echo ""
        
        echo "=== Making Executable ==="
        chmod +x wsei-course-downloader-linux-x64
        echo "Permissions set ✓"
        echo ""
        
        echo "=== Running Executable ==="
        echo "Starting WSEI Course Downloader..."
        echo "--------------------------------"
        timeout 30 ./wsei-course-downloader-linux-x64 2>&1 || {
            EXIT_CODE=$?
            echo ""
            echo "Exit code: $EXIT_CODE"
            if [ $EXIT_CODE -eq 124 ]; then
                echo "Note: Timeout after 30s (this is normal if Chrome download started)"
            fi
        }
    '

echo ""
echo "✅ Test completed!"
echo ""
echo "📝 Expected behavior:"
echo "- Executable should start without Node.js"
echo "- Should detect missing Chrome"
echo "- Should attempt to download Chrome"
echo "- May timeout during Chrome download (normal)" 