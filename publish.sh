#!/bin/sh

npx nx run-many --target=publish --projects=nlp-js-node,nlp-js-web,nlp-js-react-native,vision-js-node,vision-js-web,vision-js-react-native,ml-demo --parallel=false

