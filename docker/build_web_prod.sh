#!/bin/sh

export DOCKER_BUILDKIT=1

docker buildx build --platform linux/amd64 \
       --build-arg API_URL="https://api.safekids.ai" \
       --build-arg WEB_PORT=4200 \
       --target production \
       -f "../apps/ml-api-web/Dockerfile" \
       -t registry.digitalocean.com/safekids-ai/ml-models-web \
       ..
