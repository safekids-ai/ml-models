#!/bin/sh

npx nx run-many --target=publish --projects=nlp-js-node,nlp-js-web,vision-js-node,vision-js-web,ml-demo --parallel=false

