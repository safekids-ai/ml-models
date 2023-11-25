#!/bin/sh

npx nx run-many --target=publish --projects=nlp-js-node,nlp-js-web,nlp-js-react-native,nlp-js-types,vision-js-node,vision-js-web,vision-js-react-native,vision-js-types,ml-api-types --parallel=false
