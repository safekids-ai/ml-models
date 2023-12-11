#!/bin/sh

export DOCKER_BUILDKIT=1

docker buildx build --platform linux/amd64 \
       --build-arg API_PORT=3000 \
       --target production \
       -f ../apps/ml-api/Dockerfile \
       -t registry.digitalocean.com/safekids-ai/ml-models-api \
       ..
