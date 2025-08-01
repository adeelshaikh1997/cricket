# 🚀 Cricklytics Premium Deployment Guide

Complete deployment guide for Cricklytics Premium - powered exclusively by SportMonks Premium API.

## 📋 Prerequisites

- **SportMonks Premium API Key** (required)
- Node.js 16+ and npm
- Python 3.8+ and pip
- Git
- Domain name (for production)
- SSL certificate (recommended)

## 🔑 SportMonks Premium Setup

### 1. Get Premium API Key

1. **Visit**: [SportMonks Cricket API](https://www.sportmonks.com/cricket-api/)
2. **Choose Premium Plan**: Select the plan that fits your usage needs
3. **Complete Payment**: Process your premium subscription
4. **Get API Key**: Copy your premium API key from the dashboard

### 2. Verify API Access

Test your premium access:

```bash
curl "https://cricket.sportmonks.com/api/v2.0/teams?api_token=YOUR_PREMIUM_KEY"
```

You should see comprehensive team data with all premium includes.

## 🏗️ Local Development Setup

### Backend Configuration

Create `backend/.env`:

```bash
# Required - SportMonks Premium API Key
SPORTMONKS_API_KEY=your_premium_api_key_here

# Optional Development Settings
FLASK_DEBUG=True
PORT=5001
CRICKET_DEV_MODE=true
LOG_LEVEL=INFO
```

### Frontend Configuration

Create `frontend/.env`:

```bash
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:5001

# Optional Settings
REACT_APP_APP_NAME=Cricklytics Premium
REACT_APP_VERSION=2.0.0
```

### Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend  
cd ../frontend
npm install
```

### Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🐳 Docker Deployment

### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - SPORTMONKS_API_KEY=${SPORTMONKS_API_KEY}
      - FLASK_DEBUG=False
      - PORT=5001
    restart: unless-stopped
    
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:5001
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

### Environment File

Create `.env` for Docker:

```bash
SPORTMONKS_API_KEY=your_premium_api_key_here
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. EC2 Instance Setup

```bash
# Launch Ubuntu 20.04 LTS instance
# SSH into instance

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Application Setup

```bash
# Clone repository
git clone https://github.com/yourusername/cricklytics-premium.git
cd cricklytics-premium

# Set environment variables
echo "SPORTMONKS_API_KEY=your_premium_key" > .env

# Deploy
docker-compose up -d
```

#### 3. Security Groups

Configure AWS Security Groups:

- **Port 22**: SSH access (your IP only)
- **Port 80**: HTTP access (0.0.0.0/0)
- **Port 443**: HTTPS access (0.0.0.0/0)

### Heroku Deployment

#### 1. Heroku Setup

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create apps
heroku create cricklytics-premium-backend
heroku create cricklytics-premium-frontend
```

#### 2. Backend Deployment

```bash
cd backend

# Set config vars
heroku config:set SPORTMONKS_API_KEY=your_premium_key -a cricklytics-premium-backend

# Deploy
git subtree push --prefix=backend heroku main
```

#### 3. Frontend Deployment

```bash
cd frontend

# Set config vars
heroku config:set REACT_APP_BACKEND_URL=https://cricklytics-premium-backend.herokuapp.com -a cricklytics-premium-frontend

# Deploy
git subtree push --prefix=frontend heroku main
```

## 🌐 Production Configuration

### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5001;
    }
    
    upstream frontend {
        server frontend:3000;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com;
        
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        
        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        # Backend API
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        # Health check
        location /health {
            proxy_pass http://backend/health;
        }
    }
}
```

### SSL Certificate Setup

#### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Maintenance

### Health Monitoring

Set up monitoring endpoints:

```bash
# Backend health
curl https://yourdomain.com/health

# API usage monitoring
curl https://yourdomain.com/api-usage
```

### Log Management

```bash
# View Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Log rotation setup
sudo nano /etc/logrotate.d/docker
```

### Backup Strategy

```bash
# Regular backups
# Environment files
# SSL certificates
# Application logs
# Database (if applicable)
```

## 🚨 Troubleshooting

### Common Issues

#### 1. API Key Issues

```bash
# Verify API key
curl "https://cricket.sportmonks.com/api/v2.0/teams?api_token=YOUR_KEY"

# Check environment variables
docker exec -it backend-container env | grep SPORTMONKS
```

#### 2. Rate Limiting

```bash
# Check API usage
curl https://yourdomain.com/api-usage

# Monitor logs for rate limit errors
docker-compose logs backend | grep "rate limit"
```

#### 3. Performance Issues

```bash
# Check resource usage
docker stats

# Monitor API response times
curl -w "@curl-format.txt" -s -o /dev/null https://yourdomain.com/health
```

### Performance Optimization

#### 1. Caching Configuration

```bash
# Backend caching settings in production
CRICKET_DEV_MODE=false  # Shorter cache duration
```

#### 2. Load Balancing

For high-traffic deployments:

```yaml
# docker-compose.yml
backend:
  deploy:
    replicas: 3
```

#### 3. Database Optimization

Consider adding Redis for advanced caching:

```yaml
redis:
  image: redis:alpine
  ports:
    - "6379:6379"
  restart: unless-stopped
```

## 🔐 Security Considerations

### Environment Security

- **Never commit API keys** to version control
- **Use environment variables** for all sensitive data
- **Restrict API key permissions** to necessary scopes only
- **Monitor API usage** for unusual patterns

### Network Security

- **Enable HTTPS** for all production deployments  
- **Use firewall rules** to restrict access
- **Keep dependencies updated** regularly
- **Monitor for security vulnerabilities**

### API Security

- **Rate limiting** to prevent abuse
- **Input validation** on all endpoints
- **CORS configuration** for frontend access
- **Error handling** to prevent information leakage

## 📈 Scaling

### Horizontal Scaling

```yaml
# Scale backend instances
docker-compose up -d --scale backend=3

# Load balancer configuration
# Update nginx.conf with multiple upstream servers
```

### Vertical Scaling

```yaml
# Increase resource limits
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

## 🆘 Support

### SportMonks Premium Support

- **Priority support** included with premium subscription
- **Technical documentation** at SportMonks developer portal
- **Account management** for usage optimization

### Application Support

- **Health monitoring** via `/health` endpoint
- **API usage tracking** via `/api-usage` endpoint  
- **Comprehensive logging** for debugging
- **Error tracking** and alerting

---

**🏏 Ready to deploy your cricket analytics platform with SportMonks Premium!** 