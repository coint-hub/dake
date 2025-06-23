# idea

### Git hook for preventing commits to main
```bash
#!/bin/bash
# .git/hooks/pre-commit
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" = "main" ]; then
  echo "You can't commit directly to main branch"
  exit 1
fi
```

### Docker deployment script
```bash
#!/bin/bash
git pull origin main
docker build -t myapp:latest .
docker stop myapp || true
docker rm myapp || true
docker run -d --name myapp -p 80:80 myapp:latest
```

### Monitor disk space and alert
```bash
#!/bin/bash
usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $usage -gt 80 ]; then
  mail -s "Disk space alert" admin@example.com <<< "Disk usage is at ${usage}%"
fi
```

### Log rotation and cleanup
```bash
#!/bin/bash
find /var/log/myapp -name "*.log" -mtime +30 -exec gzip {} \;
find /var/log/myapp -name "*.gz" -mtime +90 -delete
```
