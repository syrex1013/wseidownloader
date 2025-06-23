# 🌐 Chrome Installation Guide

**WSEI Course Downloader** requires Google Chrome to be installed on your system. This guide provides installation instructions for all platforms **without requiring Node.js**.

---

## 🪟 **Windows**

### Method 1: Direct Download (Recommended)

```powershell
# 1. Visit https://www.google.com/chrome/
# 2. Click "Download Chrome"
# 3. Run the downloaded installer
# 4. Follow the installation wizard
```

### Method 2: Using Windows Package Manager (winget)

```powershell
# Open PowerShell as Administrator and run:
winget install Google.Chrome
```

### Method 3: Using Chocolatey

```powershell
# If you have Chocolatey installed:
choco install googlechrome
```

---

## 🍎 **macOS**

### Method 1: Direct Download (Recommended)

```bash
# 1. Visit https://www.google.com/chrome/
# 2. Click "Download Chrome for Mac"
# 3. Open the downloaded .dmg file
# 4. Drag Chrome to your Applications folder
```

### Method 2: Using Homebrew

```bash
# If you have Homebrew installed:
brew install --cask google-chrome
```

---

## 🐧 **Linux**

### Ubuntu/Debian

```bash
# Method 1: Using apt (Recommended)
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update
sudo apt install google-chrome-stable
```

```bash
# Method 2: Download and install .deb package
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get install -f  # Fix any dependency issues
```

### CentOS/RHEL/Fedora

```bash
# Method 1: Using dnf/yum
sudo dnf install google-chrome-stable

# Method 2: Add Google repository first
sudo tee /etc/yum.repos.d/google-chrome.repo <<EOF
[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/x86_64
enabled=1
gpgcheck=1
gpgkey=https://dl.google.com/linux/linux_signing_key.pub
EOF

sudo dnf install google-chrome-stable
```

### Arch Linux

```bash
# Using AUR helper (yay)
yay -S google-chrome

# Or using pacman with AUR
git clone https://aur.archlinux.org/google-chrome.git
cd google-chrome
makepkg -si
```

### Snap (Universal)

```bash
# Works on most Linux distributions
sudo snap install google-chrome

# Or install from Snap Store GUI
```

---

## ✅ **Verify Installation**

After installation, verify Chrome is properly installed:

### Windows

```powershell
# Check if Chrome is in PATH
chrome --version

# Or check installation directory
dir "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

### macOS

```bash
# Check if Chrome is installed
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version

# Or check with which
which google-chrome
```

### Linux

```bash
# Check Chrome version
google-chrome --version

# Or check installation
which google-chrome
```

---

## 🚨 **Troubleshooting**

### Chrome Not Found Error

If you get a "Chrome not found" error when running the WSEI downloader:

1. **Restart your terminal/command prompt** after installing Chrome
2. **Check Chrome installation path** using verification commands above
3. **Add Chrome to PATH** if necessary:

#### Windows

```powershell
# Add Chrome to PATH (if not automatically added)
$env:PATH += ";C:\Program Files\Google\Chrome\Application"
```

#### Linux/macOS

```bash
# If Chrome isn't in PATH, create a symlink
sudo ln -s /usr/bin/google-chrome /usr/local/bin/chrome
# Or add to PATH in your shell profile
echo 'export PATH="/opt/google/chrome:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Permission Issues (Linux)

```bash
# If you get permission errors, run with proper permissions:
sudo chmod +x ./wsei-downloader-linux-x64
```

### Headless Mode Issues

If you're running on a server without GUI:

```bash
# Chrome will run in headless mode automatically
# Ensure you have necessary dependencies:

# Ubuntu/Debian
sudo apt install -y fonts-liberation libasound2 libatk-bridge2.0-0 libdrm2 libgtk-3-0 libnspr4 libnss3 libxcomposite1 libxdamage1 libxrandr2 xvfb

# CentOS/RHEL
sudo yum install -y alsa-lib atk at-spi2-atk gtk3 libdrm libxcomposite libxdamage libxrandr mesa-libgbm xorg-x11-server-Xvfb
```

---

## 🎯 **Next Steps**

Once Chrome is installed:

1. **Download** the WSEI Course Downloader for your platform
2. **Make it executable** (Linux/macOS): `chmod +x wsei-downloader-*`
3. **Run the downloader**: `./wsei-downloader-*` or `wsei-downloader-*.exe`
4. **Follow the setup wizard** to configure your WSEI credentials

---

## 💡 **Alternative Browsers**

**Note**: The WSEI Course Downloader specifically requires **Google Chrome** due to Puppeteer compatibility. Other Chromium-based browsers (Edge, Brave, etc.) are not supported.

---

## 📞 **Need Help?**

If you encounter issues:

1. Check our [troubleshooting guide](https://github.com/syrex1013/wseidownloader/issues)
2. Open a [new issue](https://github.com/syrex1013/wseidownloader/issues/new) with details about your system and error
3. Include your OS version and Chrome version in bug reports

---

**Happy downloading! 🎉**
