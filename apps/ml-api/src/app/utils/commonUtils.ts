export class CommonUtils {
  static removeUnsafeFieldsFromObject(object: { [key: string]: any }): { [key: string]: any } {
    if (object == null) {
      return {}
    }
    const safeObject = new Object(object);
    Object.keys(object).forEach((prop) => {
      if (prop.toLowerCase().includes('password')) {
        delete safeObject[prop];
      }
    });
    return safeObject;
  }

  static generate6DigitAlphanumericCode = async () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';

    let code = '';
    for (let i = 0; i < 6; i++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    console.log("Abbas3")
    return code;
  };
}
