#!/bin/sh

nx run-many --target=publish --projects=nlp-js-common,nlp-js-node,nlp-js-web,vision-js-common,vision-js-node,vision-js-web,ml-demo --parallel=false

