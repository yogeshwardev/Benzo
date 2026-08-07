#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# This script configures SSL certificates for the domain

set -e

# Configuration
DOMAIN=$1
EMAIL=$2

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Usage: ./setup-ssl.sh <domain> <email>"
    echo "Example: ./setup-ssl.sh skillforge.com admin@skillforge.com"
    exit 1
fi

echo "🔒 Setting up SSL for $DOMAIN..."

# Stop nginx temporarily
echo "⏹️  Stopping nginx..."
sudo systemctl stop nginx

# Obtain SSL certificate
echo "📜 Obtaining SSL certificate from Let's Encrypt..."
sudo certbot certonly --standalone \
    --email $EMAIL \
    --agree-tos \
    --non-interactive \
    -d $DOMAIN \
    -d www.$DOMAIN

# Create SSL directory
echo "📁 Creating SSL directory..."
sudo mkdir -p ~/skillforge/docker/nginx/ssl

# Copy certificates
echo "📋 Copying certificates..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ~/skillforge/docker/nginx/ssl/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ~/skillforge/docker/nginx/ssl/

# Set permissions
sudo chmod 644 ~/skillforge/docker/nginx/ssl/fullchain.pem
sudo chmod 600 ~/skillforge/docker/nginx/ssl/privkey.pem

# Start nginx
echo "▶️  Starting nginx..."
sudo systemctl start nginx

# Setup auto-renewal
echo "🔄 Setting up auto-renewal..."
(crontab -l 2>/dev/null; echo "0 0 * * 0 certbot renew --quiet && systemctl reload nginx") | crontab -

echo "✅ SSL setup completed successfully!"
echo "🎉 Your site is now accessible at https://$DOMAIN"
