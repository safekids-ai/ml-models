<p align="center">
  <a href="https://safekids.ai">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="logo.png">
      <img src="logo.png" style="width:300px;">
    </picture>
    <h1 align="center">safekids.ai</h1>
  </a>
</p>

<p align="center">
  <a aria-label="License" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en">
    <img alt="" src="https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-red?link=href%3D%22https%3A%2F%2Fcreativecommons.org%2Flicenses%2Fby-nc-sa%2F4.0%2Fdeed.en%22">
  </a>
  <a aria-label="NPM" href="https://www.npmjs.com/search?q=%40safekids-ai">
    <img alt="" src="https://img.shields.io/badge/NPM-Published%20Packages-green?link=https%3A%2F%2Fwww.npmjs.com%2Fsearch%3Fq%3D%2540safekids-ai">
  </a>
</p>

# Machine Learning Models to Detect Hate Speech and Adult/Weapon Images and User Intent

These are local models (12MB/5MB) that detect hate speech and more and vision models that detect adult images and images of weapons.

The models can be run on node or on the browser. SDK's are available for Python, JAVA, Node and in-the-browser that can be leverage by a chrome extension.

### Install
```properties
npm install
```

### Build/Test
```properties
npx nx run-many -t test,build
```

### Release Management
```properties
npm run release
```

### Publish
```properties
npx nx run-many --target=publish --projects=nlp-js-common,nlp-js-node,nlp-js-react-native,vision-js-common,vision-js-node,vision-js-web,ml-demo --parallel=false
```

<pre>
a) make sure you have the following in your ~/.npmrc //registry.npmjs.org/:_authToken=${NPM_TOKEN}
b) define an environment variable NPM_TOKEN with the value of the token
</pre>

## NLP and Vision Classification
| NLP Classification | Vision Classification |
| ------------------ |-----------------------|
| bullying_hate      | porn                  |
| porn               | weapons               |
| proxy              | clean   ß             |
| self_harm          |                       |
| weapons            |                       |
| clean              |                       |

## Model Accuracy
| Label | Training Data Count | Test Data Count | f1 score | precision | recall |
|---|---|---|---|---|---|
| bullying_hate | 96,523 | 7,500 | 0.97 | 0.991 | 0.949 |
| clean | 1,351,563 | 20,000 | 0.98 | 0.99 | 0.9702 |
| porn | 300,082 | 6,500 | 0.97 | 0.993 | 0.948 |
| proxy | 8,038 | 200 | 0.94 | 0.988 | 0.896 |
| self_harm | 180,826 | 5,000 | 0.96 | 0.984 | 0.937 |
| weapons | 74,802 | 4,000 | 0.96 | 0.989 | 0.932 |

## Glossary of Terms
<small>
<b>Precision</b><br>
number of true positives / total positive predictions. - indicates the confidence of a model. i.e: if precision for class X is 0.99, 99% chance that if model predicts class X for an input, 99% chance that correct label is also X

<p></p>
<b>Recall</b><br>
number of true positives/ total positive  labels in test set. --- indicates how many of the total inputs belonging to a class in test set are correctly caught by the model

<p></p>
<b>F1 score</b><br>
harmonic mean of Precision and  Recall. - the general accuracy measure for classification that balances out precision and recall
</small>

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
import {NLPWeb} from '@safekids-ai/nlp-js-react-native'
//initialize the model
nlp = new NLPWeb("nlp.onnx");
await nlp.init();
```
#### Run the image classification model directly in the browser or used in chrome extension

```typescript
import {VisionWeb} from '@safekids-ai/vision-js-web'
vision = new VisionWeb("vision.onnx");
await vision.init();
```

#### Run the text and image classification model in Python
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
### License
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
