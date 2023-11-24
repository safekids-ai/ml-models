import axios from 'axios';
import {NLPRequestDto} from "../../../ml-demo-api/src/app/types/NLPTypes";
import {NLPLabel, NLPResult} from "@safekids-ai/nlp-js-types";

describe('GET /api/v1/hello', () => {
  it('ping', async () => {
    const res = await axios.get(`api/v1/hello`);

    expect(res.status).toBe(200);
    //expect(res.data).toEqual({ message: 'Hello API' });
  });
});

describe('POST /api/v1/find-hate', () => {
  it('should be clean', async () => {
    const res = await axios.post(`api/v1/find-hate`, {
      message : "you are amazing."
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    const expected: NLPResult = {flag: false, label: NLPLabel.Clean, flaggedText: ""}
    expect(res.data).toEqual(expected);
  });

  it('should be hateful', async () => {
    const res = await axios.post(`api/v1/find-hate`, {
      message : "you are amazing. but you're also an asshole"
    } as NLPRequestDto);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    const expected: NLPResult = {flag: true, label: NLPLabel.HateBullying, flaggedText: "but you're also an asshole"}
    expect(res.data).toEqual(expected);
  });
});
