#!/bin/bash

# Automated EC2 Setup Script for Gutendex Book Browser
# Run this script after SSH'ing into your fresh EC2 instance

echo "🚀 Gutendex Book Browser - EC2 Automated Setup"
echo "==============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ]; then
    print_error "This script should be run as ubuntu user"
    exit 1
fi

# Update system
print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Install Node.js 18.x
print_info "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
NODE_VERSION=$(node --version)
print_success "Node.js installed: $NODE_VERSION"

# Install Nginx
print_info "Installing Nginx..."
sudo apt install -y nginx
print_success "Nginx installed"

# Install Git
print_info "Installing Git..."
sudo apt install -y git
print_success "Git installed"

# Install PM2
print_info "Installing PM2..."
sudo npm install -g pm2
print_success "PM2 installed"

# Clone repository
print_info "Cloning repository..."
cd ~
if [ -d "gutendex-react" ]; then
    print_info "Repository already exists, pulling latest..."
    cd gutendex-react
    git pull origin main
else
    git clone https://github.com/Rohi7875/gutendex-react.git
    cd gutendex-react
fi
print_success "Repository ready"

# Install dependencies
print_info "Installing npm dependencies..."
npm install
print_success "Dependencies installed"

# Build application
print_info "Building application..."
npm run build
print_success "Application built"

# Set up Nginx
print_info "Configuring Nginx..."

# Get EC2 public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Create Nginx config
sudo tee /etc/nginx/sites-available/gutendex > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $EC2_IP;

    root /home/ubuntu/gutendex-react/dist;
    index index.html;

    access_log /var/log/nginx/gutendex_access.log;
    error_log /var/log/nginx/gutendex_error.log;

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location /api/books {
        rewrite ^/api/books(.*)\$ /books\$1 break;
        proxy_pass http://skunkworks.ignitesol.com:8000;
        proxy_http_version 1.1;
        proxy_set_header Host skunkworks.ignitesol.com;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        add_header Access-Control-Allow-Origin *;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|css|js|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/gutendex /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
if sudo nginx -t; then
    print_success "Nginx configuration valid"
else
    print_error "Nginx configuration invalid"
    exit 1
fi

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
print_success "Nginx configured and running"

# Make deploy script executable
chmod +x ~/gutendex-react/deploy.sh

echo ""
echo "==============================================="
print_success "Setup Complete! 🎉"
echo ""
echo "Your app is now live at:"
echo "  👉 http://$EC2_IP"
echo ""
echo "To update your app later:"
echo "  cd ~/gutendex-react"
echo "  ./deploy.sh"
echo ""
echo "View logs:"
echo "  sudo tail -f /var/log/nginx/access.log"
echo ""
echo "Check Nginx status:"
echo "  sudo systemctl status nginx"
echo ""
print_success "Happy coding! 🚀"
echo "==============================================="

