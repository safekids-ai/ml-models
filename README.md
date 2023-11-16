<p align="center">
  <a href="https://safekids.ai">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="logo.png">
      <img src="logo.png" height="120">
    </picture>
    <h1 align="center">safekids.ai</h1>
  </a>
</p>

<p align="center">
  <a aria-label="Safekids logo" href="https://safekids.ai">
    <img src="https://img.shields.io/badge/MADE%20BY%20SafeKids-000000.svg?style=for-the-badge&logo=Safekids&labelColor=000">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/safekids-ai">
    <img alt="" src="https://img.shields.io/npm/v/next.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en">
    <img alt="" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="Join the community on GitHub" href="https://github.com/safekids-ai/ml-models/discussions">
    <img alt="" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=Next.js&labelColor=000000&logoWidth=20">
  </a>
</p>

# Machine Learning Models to Detect Hate Speech and Adult/Weapon Images and User Intent

These are local models (12MB/5MB) that detect hate speech and more and vision models that detect adult images and images of weapons.

The models can be run on node or on the browser. SDK's are available for Python, JAVA, Node and in-the-browser that can be leverage by a chrome extension.

## Basic script for install and building the repo
<pre>
# to install the application
npm install

# to do a build and test
./build.sh or npx nx run-many -t test,build

# to do a git release
npm run release

# to publish to npm repos
a) make sure you have the following in your ~/.npmrc //registry.npmjs.org/:_authToken=${NPM_TOKEN}
b) define an environment variable NPM_TOKEN with the value of the token
c) 
run
./publish.sh or 
npx nx run-many --target=publish --projects=nlp-js-common,nlp-js-node,nlp-js-web,vision-js-common,vision-js-node,vision-js-web,ml-demo --parallel=false
</pre>

## NLP Classification Types
Main classification categories supported are:

    bullying_hate
    clean
    porn
    proxy
    self_harm
    weapons

## Vision Classification Types
    porn
    weapons

## Model Accuracy
| Label | Training Data Count | Test Data Count | f1 score | precision | recall |
|---|---|---|---|---|---|
| bullying_hate | 96,523 | 7,500 | 0.97 | 0.991 | 0.949 |
| clean | 1,351,563 | 20,000 | 0.98 | 0.99 | 0.9702 |
| porn | 300,082 | 6,500 | 0.97 | 0.993 | 0.948 |
| proxy | 8,038 | 200 | 0.94 | 0.988 | 0.896 |
| self_harm | 180,826 | 5,000 | 0.96 | 0.984 | 0.937 |
| weapons | 74,802 | 4,000 | 0.96 | 0.989 | 0.932 |

### Glossary of Terms
| precision | number of true positives / total positive predictions. - indicates the confidence of a model. i.e: if precision for class X is 0.99, 99% chance that if model predicts class X for an input, 99% chance that correct label is also X | recall | number of true positives/ total positive  labels in test set. --- indicates how many of the total inputs belonging to a class in test set are correctly caught by the model. | f1 score | harmonic mean of Precision and  Recall. - the general accuracy measure for classification that balances out precision and recall |
|---|---|---|---|---|---|

## API Reference

#### Run the text classification model in node

```typescript
//initialize the model
import {NLPNode} from '@safekids-ai/nlp-js-node'

nlp = new NLPNode("nlp.onnx");
await nlp.init();

//run the hate classifier
expect(await nlp.findHate("I love samosa. Mike is an asshole. Safekids is awesome!"))
    .toEqual({flag: true, label: 'hate_bullying', flaggedText: 'Mike is an asshole.'});

//text classification
expect(await nlp.classifyText("Darrell Brooks' mother wants to 'curl up and die' after verdict | FOX6 News Milwaukee"))
    .toEqual("clean");

expect(await nlp.classifyText("I want to kill myself | Samaritans"))
    .toEqual("self_harm");

expect(await nlp.classifyText("Milf Porn Videos: Mature Mom Sex Videos - RedTube.com"))
    .toEqual("porn");

```
#### Run the image classification model in node

```typescript
import {VisionNode} from '@safekids-ai/vision-js-node'
vision = new VisionNode("vision.onnx");
await vision.init();
const buffer: ImageData = getSync(qa_path + "gun1.jpg");
const pred = await vision.classifyImageData(buffer);
expect(pred).toEqual("weapons");
```

#### Run the text classification directly in the browser!
```typescript
import {NLPWeb} from '@safekids-ai/nlp-js-web'
//initialize the model
nlp = new NLPWeb("nlp.onnx");
await nlp.init();
```
#### Run the image classification model directly in the browser or used in chrome extension

```typescript
  import {VisionWeb, VisionLabel} from '@safekids-ai/vision-js-web'
  vision = new VisionWeb("vision.onnx");
  await vision.init();
```


# License
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en

# SafeKids.ai

- SafeKids' models for light weight NSFW detection in images and text
- ... are idenified in images
- ... are identified in text

#### in-browser demo (models running on your browser):

#### Python

```bash
pip install --upgrade safekids
```

```python
from safekids import SafeText
safe_text_classifier = SafeText()
safe_text_classifier.classify("text to classify")
```

```python
from safekids import SafeImage
safe_image_classifier = SafeImage
safe_image_classifier.classify("path_to_image")
```


#### Java


#### Javascript



# Licensing
The code is governed by GPL3 but for NON COMMERCIAL USE ONLY. For commercial use, contact us at licensing@safekids.ai
