docker-compose.yml for deployment

```
version: "3.8"

services:
  web:
    image: registry.infinitelogic.com/safekids-ai/demo
    container_name: safekids-demo
    ports:
      - "9101:80"
    restart: unless-stopped
    healthcheck:
      # Use curl to verify the app on port 3000 responds (follows redirects, quiet, 5s cap).
      test: ["CMD-SHELL", "curl -fsSL --max-time 5 http://127.0.0.1:80/ -o /dev/null || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s

```