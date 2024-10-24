export class StringUtils {
  static ltrim(val: string, length: number): string {
    if (!val) {
      return val;
    }
    const max = Math.min(val.length, length);
    return val.substring(0, max);
  }
}
