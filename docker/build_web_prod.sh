#!/bin/sh

docker build \
       --build-arg API_URL="https://api.safekids.ai" \
       --build-arg WEB_PORT=4200 \
       --target production \
       -f "../apps/ml-api-web/Dockerfile" \
       -t registry.digitalocean.com/safekids-ai/ml-models-web \
       ..
