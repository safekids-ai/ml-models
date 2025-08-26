docker-compose.yml for deployment

note: port is 3000 converted into hex

```
version: "3.8"

services:
  web:
    image: registry.infinitelogic.com/safekids-ai/web
    container_name: snowlawnpro-web
    ports:
      - "9100:3000"   # host 9100 → container 3000
    restart: unless-stopped
    healthcheck:
      # No curl/wget: check that port 3000 (0x0BB8) is listening via /proc.
      # Prefer /bin/grep if present; otherwise fall back to awk.
      test:
        [
          "CMD-SHELL",
          "if [ -x /bin/grep ]; then /bin/grep -q ':0BB8 ' /proc/net/tcp || /bin/grep -q ':0BB8 ' /proc/net/tcp6; else awk '{if (\\$2 ~ /:0BB8$/) f=1} END{exit f?0:1}' /proc/net/tcp /proc/net/tcp6 2>/dev/null; fi"
        ]
      interval: 15s
      timeout: 3s
      retries: 5
      start_period: 20s
```