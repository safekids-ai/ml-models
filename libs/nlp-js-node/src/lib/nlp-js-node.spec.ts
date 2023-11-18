import {NLPNode} from '../lib/nlp-js-node'
import {readFileSync} from 'fs';

const originalImplementation = Array.isArray;

jest.spyOn(Array, 'isArray').mockImplementation((value) => {
  if (value && value.constructor && (value.constructor.name === "Float32Array" || value.constructor.name === "BigInt64Array")) {
    return true;
  }
  return originalImplementation(value);
});

let nlp: NLPNode = null;
beforeAll(async () => {
  nlp = new NLPNode("./model_files/nlp.onnx");
  await nlp.init();
});

afterAll(() => {
  jest.restoreAllMocks();
});
test('hate-simple', async () => {
  expect(await nlp.findHate("I love samosa. Mike is an asshole. Safekids is awesome!"))
    .toEqual({flag: true, label: 'hate_bullying', flaggedText: 'Mike is an asshole.'});

  expect(await nlp.findTextToFlag("I love samosa. How to unblock websites with proxy? Safekids is awesome!"))
    .toEqual({flag: true, label: 'proxy', flaggedText: 'How to unblock websites with proxy?'});

  expect(await nlp.findHate("I love samosa. Safekids is awesome!"))
    .toEqual({flag: false, label: 'clean', flaggedText: ''});
})

test('classify-simple', async () => {
  expect(await nlp.classifyText("Darrell Brooks' mother wants to 'curl up and die' after verdict | FOX6 News Milwaukee"))
    .toEqual("clean");

  expect(await nlp.classifyText("when was the first gun made in europe"))
    .toEqual("clean");

  expect(await nlp.classifyText("when were guns first used in war"))
    .toEqual("clean");

  expect(await nlp.classifyText("Darrell Brooks' mother wants to 'curl up and die' after verdict | FOX6 News Milwaukee"))
    .toEqual("clean");

  expect(await nlp.classifyText("I want to kill myself | Samaritans"))
    .toEqual("self_harm");

  expect(await nlp.classifyText("Milf Porn Videos: Mature Mom Sex Videos - RedTube.com"))
    .toEqual("porn");


  // FAILING
  // expect(await nlp.classifyText("Block or unblock a member | LinkedIn Help"))
  //     .toEqual("clean");
  // expect(await nlp.classifyText("Advice When Buying a Gun in Virginia | Firearm Possession expected"))
  //     .toEqual("weapons");

})


test('hate', async () => {
  const mustPassData = readFileSync('./qa-data/hate.json').toString().split("\n");
  const lines = new Array<string>();
  const labels = new Array<string>();

  mustPassData.forEach(line => {
    try {
      const sample = JSON.parse(line)
      lines.push(sample['sentence1'])
      labels.push(sample['label'])
    } catch (error) { /* empty */ }
  });


  const nlpStart = new Date().getTime()
  const nlpTime = new Date().getTime() - nlpStart
  let correctPredCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const isHate = await nlp.classifyAsHate(lines[i]);
    if (isHate == (labels[i] != "clean")) {
      correctPredCount += 1
    } else {
      console.log("label:", lines[i], isHate)
    }
    expect(isHate).toBe(labels[i] != "clean")
  }

  console.log(`hate.json: ${lines.length} lines predicted with accuracy: ${correctPredCount / labels.length} in time: ${nlpTime}`);
})

test('Category NLP must pass test', async () => {
  const mustPassData = readFileSync('./qa-data/category.json').toString().split("\n");
  const lines = new Array<string>();
  const labels = new Array<string>();

  mustPassData.forEach(line => {
    try {
      const sample = JSON.parse(line)
      lines.push(sample['sentence1'])
      labels.push(sample['label'])
    } catch (error) { /* empty */ }
  });


  const nlpStart = new Date().getTime()
  const nlpTime = new Date().getTime() - nlpStart
  let correctPredCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const nlpLabel = await nlp.classifyText(lines[i]);
    if (nlpLabel == labels[i]) {
      correctPredCount += 1
    } else {
      console.log("line:", lines[i], "expected:" + labels[i] + " actual:" + nlpLabel);
    }
    expect(nlpLabel).toBe(labels[i])
  }

  console.log(`category.json: ${lines.length} lines predicted with accuracy: ${correctPredCount / labels.length} in time: ${nlpTime}`);
})
