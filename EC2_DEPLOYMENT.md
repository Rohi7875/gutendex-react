# 🚀 Deploy to AWS EC2 - Complete Guide

## ✅ Why EC2?
- Full control over server
- No Vercel limitations
- Better for production apps
- Can handle HTTP/HTTPS properly
- Cost-effective for long-term hosting

---

## 📋 Prerequisites

- AWS Account (free tier works!)
- Domain name (optional, can use IP address)
- SSH client (Terminal/PowerShell/PuTTY)

---

## 🎯 Step-by-Step Deployment

### **Step 1: Create EC2 Instance**

#### 1.1 Launch Instance
1. **Go to:** https://console.aws.amazon.com/ec2
2. **Click:** "Launch Instance"
3. **Name:** `gutendex-book-browser`

#### 1.2 Choose AMI
- **Select:** Ubuntu Server 22.04 LTS (Free tier eligible)
- **Architecture:** 64-bit (x86)

#### 1.3 Instance Type
- **Select:** `t2.micro` (Free tier - 1GB RAM)
- Or `t3.small` (2GB RAM - better performance)

#### 1.4 Key Pair
- **Create new key pair:**
  - Name: `gutendex-key`
  - Type: RSA
  - Format: `.pem` (for Mac/Linux) or `.ppk` (for Windows/PuTTY)
- **Download** and save securely!

#### 1.5 Network Settings
- **Allow SSH** (port 22) - Your IP only
- **Allow HTTP** (port 80) - From anywhere
- **Allow HTTPS** (port 443) - From anywhere
- **Allow Custom TCP** (port 3000) - From anywhere (for testing)

#### 1.6 Storage
- **Size:** 8 GB (Free tier) or 20 GB (recommended)

#### 1.7 Launch!
- Click **"Launch Instance"**
- Wait ~1 minute for instance to start

---

### **Step 2: Connect to Your EC2 Instance**

#### 2.1 Get Instance Details
1. Go to EC2 Dashboard
2. Select your instance
3. Copy **Public IPv4 address** (e.g., `54.123.45.67`)

#### 2.2 Connect via SSH

**On Windows (PowerShell):**
```powershell
# Set key permissions (first time only)
icacls gutendex-key.pem /inheritance:r
icacls gutendex-key.pem /grant:r "%username%:R"

# Connect
ssh -i gutendex-key.pem ubuntu@YOUR_EC2_IP
```

**On Mac/Linux:**
```bash
# Set key permissions (first time only)
chmod 400 gutendex-key.pem

# Connect
ssh -i gutendex-key.pem ubuntu@YOUR_EC2_IP
```

**Expected Output:**
```
Welcome to Ubuntu 22.04 LTS
ubuntu@ip-xxx-xxx-xxx-xxx:~$
```

---

### **Step 3: Install Required Software**

Run these commands on your EC2 instance:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x

# Install Nginx (web server)
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install PM2 (process manager)
sudo npm install -g pm2
```

---

### **Step 4: Deploy Your Application**

```bash
# Clone your repository
cd ~
git clone https://github.com/Rohi7875/gutendex-react.git
cd gutendex-react

# Install dependencies
npm install

# Build the app
npm run build

# The build output is in the 'dist' folder
ls dist/
```

---

### **Step 5: Set Up Nginx**

#### 5.1 Create Nginx Configuration

```bash
# Create config file
sudo nano /etc/nginx/sites-available/gutendex
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    root /home/ubuntu/gutendex-react/dist;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy for API requests (fixes HTTPS/HTTP issue)
    location /api/books {
        proxy_pass http://skunkworks.ignitesol.com:8000/books;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Replace:** `YOUR_DOMAIN_OR_IP` with your EC2 IP or domain

**Save:** `Ctrl+X`, then `Y`, then `Enter`

#### 5.2 Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/gutendex /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Should say: "configuration file /etc/nginx/nginx.conf test is successful"

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

---

### **Step 6: Test Your Application**

Open browser and visit:
```
http://YOUR_EC2_IP
```

You should see your Gutendex app! 🎉

---

### **Step 7: Set Up Auto-Deployment (Optional)**

Create a deployment script:

```bash
cd ~/gutendex-react
nano deploy.sh
```

**Paste:**

```bash
#!/bin/bash
echo "🚀 Deploying Gutendex Book Browser..."

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart Nginx
sudo systemctl restart nginx

echo "✅ Deployment complete!"
```

**Make executable:**

```bash
chmod +x deploy.sh
```

**To deploy updates later:**

```bash
cd ~/gutendex-react
./deploy.sh
```

---

## 🔒 Step 8: Add HTTPS (Optional but Recommended)

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)

# Auto-renewal is set up automatically
# Test renewal:
sudo certbot renew --dry-run
```

**Now visit:** `https://yourdomain.com` 🔒

---

## 📊 Monitoring & Management

### Check Nginx Status
```bash
sudo systemctl status nginx
```

### View Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
sudo systemctl restart nginx
```

---

## 🎯 Update Your App Code

When you push changes to GitHub:

```bash
# SSH into EC2
ssh -i gutendex-key.pem ubuntu@YOUR_EC2_IP

# Run deployment script
cd ~/gutendex-react
./deploy.sh
```

---

## 💰 Cost Estimate

### Free Tier (12 months)
- **t2.micro:** FREE
- **Storage (30GB):** FREE
- **Transfer (15GB/month):** FREE
- **Total:** $0/month

### After Free Tier
- **t2.micro:** ~$8-10/month
- **t3.small:** ~$15-17/month
- **Storage:** ~$1-2/month
- **Total:** ~$10-20/month

---

## 🔧 Troubleshooting

### App Not Loading?

**Check Nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
```

**Check Build Files:**
```bash
ls ~/gutendex-react/dist/
# Should see index.html and assets/
```

### API Not Working?

**Check Nginx Proxy:**
```bash
curl http://localhost/api/books?mime_type=image/
```

**Check Firewall:**
```bash
sudo ufw status
# Make sure ports 80, 443 are allowed
```

### Connection Refused?

**Check Security Group:**
1. EC2 Console → Security Groups
2. Edit inbound rules
3. Allow HTTP (80), HTTPS (443)

---

## 📝 Quick Reference Commands

```bash
# SSH to server
ssh -i gutendex-key.pem ubuntu@YOUR_EC2_IP

# Deploy updates
cd ~/gutendex-react && ./deploy.sh

# Restart Nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/access.log

# Check disk space
df -h

# Check memory
free -m
```

---

## 🎊 Your App URLs

**After deployment:**

**HTTP:**
```
http://YOUR_EC2_IP
```

**With Domain:**
```
http://yourdomain.com
```

**With HTTPS:**
```
https://yourdomain.com
```

**API Proxy:**
```
http://YOUR_EC2_IP/api/books
```

---

## 🚀 Next Steps

1. ✅ Deploy on EC2
2. ✅ Test all features
3. ✅ Point domain to EC2 (optional)
4. ✅ Add HTTPS with Let's Encrypt
5. ✅ Set up monitoring
6. ✅ Share your app!

---

## 📞 Support

**AWS Documentation:**
- EC2: https://docs.aws.amazon.com/ec2
- Free Tier: https://aws.amazon.com/free

**Need Help?**
- AWS Support
- Stack Overflow
- AWS Forums

---

## ✨ Advantages of EC2 Deployment

✅ Full server control
✅ No vendor lock-in
✅ Better debugging
✅ Custom configurations
✅ Nginx proxy handles HTTP/HTTPS
✅ Can install any software
✅ SSH access anytime
✅ Free tier available
✅ Production-ready
✅ Scalable

---

## 🎉 You're All Set!

Your Gutendex Book Browser is now:
- Running on AWS EC2
- Accessible worldwide
- Production-ready
- Fully under your control

**Happy deploying! 🚀**

