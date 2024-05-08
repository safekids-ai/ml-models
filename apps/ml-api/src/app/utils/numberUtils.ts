export class NumberUtils {
    static create6DigitRandom(): number {
        return Math.floor(100000 + Math.random() * 900000);
    }
}
