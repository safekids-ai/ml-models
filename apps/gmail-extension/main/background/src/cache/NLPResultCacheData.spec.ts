import {NLPResultCacheData} from "./cache/NLPResultCacheData";

describe ("NLPResultCacheData", () => {
    test('all methods', async () => {
        const cache = new NLPResultCacheData("a|b", "c|d", "e|f", "g|h");
        expect(cache.isClean("a")).toBe(true);
        expect(cache.isClean("b")).toBe(true);
        expect(cache.isToxic("c")).toBe(true);
        expect(cache.isToxic("d")).toBe(true);
        expect(cache.isClean("e")).toBe(true);
        expect(cache.isClean("f")).toBe(true);
        expect(cache.isToxic("g")).toBe(true);
        expect(cache.isToxic("h")).toBe(true);

        expect(cache.exists("a")).toBe(true);
        expect(cache.exists("c")).toBe(true);
        expect(cache.exists("e")).toBe(true);
        expect(cache.exists("g")).toBe(true);
    });
});

