#!/bin/sh

npx nx run-many -t clean,build,test --no-cache
