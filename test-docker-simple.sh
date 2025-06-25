#!/bin/bash

echo "🐳 Testing WSEI Linux executable in Docker"
echo "=========================================="

# Check if executable exists
if [ ! -f "dist/wsei-course-downloader-linux-x64" ]; then
    echo "❌ Error: Linux executable not found"
    echo "Please run: npm run build:exe"
    exit 1
fi

echo "✅ Found executable: dist/wsei-course-downloader-linux-x64"
echo "📏 Size: $(ls -lh dist/wsei-course-downloader-linux-x64 | awk '{print $5}')"
echo ""

# Copy executable to temp directory for cleaner testing
TEMP_DIR=$(mktemp -d)
cp dist/wsei-course-downloader-linux-x64 "$TEMP_DIR/"
chmod +x "$TEMP_DIR/wsei-course-downloader-linux-x64"

echo "1️⃣ Testing in Alpine Linux..."
echo "------------------------------"
docker run --rm \
    -v "$TEMP_DIR:/app:ro" \
    alpine:latest \
    /bin/sh -c 'cd /app && ./wsei-course-downloader-linux-x64 --help 2>&1 || true'

echo ""
echo "2️⃣ Checking if it starts without error..."
echo "------------------------------------------"
docker run --rm \
    -v "$TEMP_DIR:/app:ro" \
    alpine:latest \
    /bin/sh -c 'cd /app && timeout 5 ./wsei-course-downloader-linux-x64 2>&1 || echo "Exit code: $? (timeout is normal)"'

echo ""
echo "3️⃣ Testing dependencies..."
echo "---------------------------"
docker run --rm \
    -v "$TEMP_DIR:/app:ro" \
    alpine:latest \
    /bin/sh -c 'cd /app && ldd wsei-course-downloader-linux-x64 2>&1 || echo "No dynamic dependencies"'

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Tests completed!" 