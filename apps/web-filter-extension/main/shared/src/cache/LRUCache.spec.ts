import { LRUCache } from './LRUCache';

describe('LRUCache Test', () => {
    beforeEach(() => {});
    it('Should test cache value', async () => {
        let cache = new LRUCache(3);
        cache.set('key4', false);
        cache.set('key1', true);
        cache.set('key2', true);
        cache.set('key2', true);
        cache.set('key3', false);

        let has = cache.has('key1');
        expect(has).toBeTruthy();

        has = cache.has('key4');
        expect(has).toBeFalsy();

        let result = cache.get('key1');
        expect(result).toBeTruthy();

        result = cache.get('key3');
        expect(result).toBeFalsy();

        cache.clear();

        result = cache.get('key1');
        expect(result).toBeFalsy();
    });
});
