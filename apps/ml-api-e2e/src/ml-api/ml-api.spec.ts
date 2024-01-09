import axios from 'axios';
import {NLPRequestDto} from "@safekids-ai/ml-api-types";
import {NLPLabel, NLPResult} from "@safekids-ai/nlp-js-types";
import * as fs from "fs";
import {VisionLabel} from "@safekids-ai/vision-js-types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');

const qa_path = "./qa-data/vision/";

describe('GET /v1/hello', () => {
  console.log("BaseURL:" + axios.defaults.baseURL)
  it('ping', async () => {
    const res = await axios.get(`/v1/hello`);

    expect(res.status).toBe(200);
  });
});

describe('POST /v1/classify-hate', () => {
  it('should be clean', async () => {
    const res = await axios.post(`/v1/classify-hate`, {
      message : "you are amazing."
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    const expected: NLPResult = {flag: false, label: NLPLabel.Clean, flaggedText: ""}
    expect(res.data).toEqual(expected);
  });

  it('should be hateful', async () => {
    const res = await axios.post(`/v1/classify-hate`, {
      message : "you are amazing. but you're also an asshole"
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    const expected: NLPResult = {flag: true, label: NLPLabel.HateBullying, flaggedText: "but you're also an asshole"}
    expect(res.data).toEqual(expected);
  });
});

describe('POST /v1/classify-text', () => {
  it('should be clean', async () => {
    const res = await axios.post(`/v1/classify-text`, {
      message : "you are amazing."
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.data).toEqual(NLPLabel.Clean);
  });

  it('should be hate', async () => {
    const res = await axios.post(`/v1/classify-text`, {
      message : "you are an asshole."
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.data).toEqual(NLPLabel.HateBullying);
  });

  it('should be adult', async () => {
    const res = await axios.post(`/v1/classify-text`, {
      message : "find adult sex links videos"
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.data).toEqual(NLPLabel.Porn);
  });

  it('should be proxy', async () => {
    const res = await axios.post(`/v1/classify-text`, {
      message : "find proxy websites to get around filters"
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.data).toEqual(NLPLabel.Proxy);
  });

  it('should be weapons', async () => {
    const res = await axios.post(`/v1/classify-text`, {
      message : "where do I buy a gun"
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.data).toEqual(NLPLabel.Weapons);
  });

  it('should be self harm', async () => {
    const res = await axios.post(`/v1/classify-text`, {
      message : "how do i hurt myself"
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.data).toEqual(NLPLabel.SelfHarm);
  });
});

describe('POST /v1/classify-image', () => {
  it('should be clean', async () => {
    const form = new FormData();
    const buffer = fs.readFileSync(qa_path + 'clean1.jpg');
    form.append ('file',  buffer, 'clean1.jpg');

    const res = await axios.post(`/v1/classify-image`, form, {
      headers: {
        ...form.getHeaders()
      }
    });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.data).toEqual(VisionLabel.Clean);
  });

  it('should be weapons', async () => {
    const form = new FormData();
    const buffer = fs.readFileSync(qa_path + 'gun1.jpg');
    form.append ('file',  buffer, 'gun1.jpg');

    const res = await axios.post(`/v1/classify-image`, form, {
      headers: {
        ...form.getHeaders()
      }
    });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.data).toEqual(VisionLabel.Weapons);
  });
});
