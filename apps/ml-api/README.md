docker-compose.yml for deployment

```
version: "3.8"

services:
  web:
    image: registry.infinitelogic.com/safekids-ai/api
    container_name: safekids-api
    ports:
      - "9103:3000"
    restart: unless-stopped
    healthcheck:
      # Use curl to verify the app on port 3000 responds (follows redirects, quiet, 5s cap).
      test:
        [
          "CMD-SHELL",
          "if [ -x /bin/grep ]; then /bin/grep -q ':0BB8 ' /proc/net/tcp || /bin/grep -q ':0BB8 ' /proc/net/tcp6; else awk '{if (\\$2 ~ /:0BB8$/) f=1} END{exit f?0:1}' /proc/net/tcp /proc/net/tcp6 2>/dev/null; fi"
        ]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s

```