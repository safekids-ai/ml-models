
# Machine Learning Models to Detect Hate Speech and Adult/Weapon Images and User Intent

These are local models (12MB/5MB) that detect hate speech and more and vision models that detect adult images and images of weapons.

The models can be run on node or on the browser. SDK's are available for Python, JAVA, Node and in-the-browser that can be leverage by a chrome extension.

You can try out our API using docs at: <br>
https://api.safekids.ai/api

### Classify Toxic Speech
```console
curl -X 'POST' \
  'https://api.safekids.ai/v1/classify-toxic' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "message": "you'\''re a disgusting person"
}'

RESPONSE:
{
  "flag": true,
  "label": "bullying_hate",
  "flaggedText": "you're a disgusting person"
}
```

### Classify Google Search Intent
```console
curl -X 'POST' \
  'https://api.safekids.ai/v1/classify-text' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "message": "find adult sex links videos"
}'

RESPONSE:
porn
```

### Classify Image
```console
curl -X 'POST' \
  'https://api.safekids.ai/v1/classify-image' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '"string"'
  
RESPONSE:
porn
```

[![Try a Demo of our Hate Model](assets/markdown/demo_model.png 'Demo Playground')](https://demo.safekids.ai/hate)

## NLP and Vision Classification
| NLP Classification | Vision Classification |
| ------------------ |----------------|
| bullying_hate      | porn           |
| porn               | weapons        |
| proxy              | clean          |
| self_harm          |                |
| weapons            |                |
| clean              |                |

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
#### Download models here
[Model Files ONNX for NLP and Vision](https://github.com/safekids-ai/ml-models/tree/main/model_files) 

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
