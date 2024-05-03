export class CommonUtils {
    static removeUnsafeFieldsFromObject(object: { [key: string]: any }): { [key: string]: any } {
        const safeObject = new Object(object);
        Object.keys(object).forEach((prop) => {
            if (prop.toLowerCase().includes('password')) {
                delete safeObject[prop];
            }
        });
        return safeObject;
    }

    static generate6DigitAlphanumericCode = async () => {
      console.log("Abbas1")
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
      console.log("Abbas2")

        let code = '';
        for (let i = 0; i < 6; i++) {
            code += charset.charAt(Math.floor(Math.random() * charset.length));
        }
      console.log("Abbas3")
        return code;
    };
}
