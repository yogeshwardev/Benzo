#!/bin/bash

# Systemd Service Installation Script
# This script installs the SkillForge service for auto-restart

set -e

echo "🔧 Installing systemd service for SkillForge Academy..."

# Copy service file
sudo cp skillforge.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable skillforge

# Start service
sudo systemctl start skillforge

# Check status
sudo systemctl status skillforge

echo "✅ Systemd service installed and started"
echo "🔄 Service will auto-start on system boot"
