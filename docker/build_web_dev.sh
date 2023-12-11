#!/bin/sh

docker build \
       --build-arg API_URL="http://localhost:3000" \
       --build-arg WEB_PORT=4200 \
       --target production \
       -t safekids-ai/ml-models-web-dev \
       -f ../apps/ml-api-web/Dockerfile \
       ..

