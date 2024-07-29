
import {VisionNode} from '../lib/vision-js-node'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getSync } = require('@andreekeberg/imagedata')

const originalImplementation = Array.isArray;

jest.spyOn(Array, 'isArray').mockImplementation((value) => {
  if (value && value.constructor && (value.constructor.name === "Float32Array" || value.constructor.name === "BigInt64Array")) {
    return true;
  }
  return originalImplementation(value);
});

let vision: VisionNode = null;
beforeAll(async () => {
  vision = new VisionNode("./model_files/vision.onnx");
  await vision.init();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const qa_path = "./qa-data/vision/";

function toImageData(path: string) {
  const content: string = fs.readFileSync(path, "utf8");
  const buffer: Buffer = Buffer.from(content, 'base64');
  return getSync(buffer);
}


test('clean', async () => {
  const buffer: ImageData = getSync(qa_path + "clean1.jpg");
  const pred = await vision.classifyImage(buffer);
  expect(pred).toEqual("clean");
});

test('weapons', async () => {
  const buffer: ImageData = getSync(qa_path + "gun1.jpg");
  const pred = await vision.classifyImage(buffer);
  expect(pred).toEqual("weapons");
});

test('weapons-as-binary', async () => {
  const buffer = fs.readFileSync(qa_path + "gun1.jpg");
  const pred = await vision.classifyImageBuffer(buffer);
  expect(pred).toEqual("weapons");
});

// test('adult-binary', async () => {
//     const data: ImageData = getSync(qa_path + "image.jpg");
//     console.log("working Height:" + data.height, "width:" + data.width + ",color:" + data.colorSpace);
//     const pred = await vision.classifyImageData(data);
//     expect(pred).toEqual("porn");
// });

test('adult-b64', async () => {
  //const data: VisionImageData = await fromBase64(qa_path + "adult1.jpeg.b64");
  const data = toImageData(qa_path + "adult1.jpeg.b64");
  const pred = await vision.classifyImage(data);
  expect(pred).toEqual("porn");
});

