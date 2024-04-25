import AWS_SDK from 'aws-sdk';

const {KMS} = AWS_SDK

const kms = new KMS({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export class CryptoUtil {
    static async encrypt(plainText) {
        const params = {
            KeyId: process.env.AWS_KMS_KEY_ID,
            Plaintext: plainText,
        };
        const { CiphertextBlob } = await kms.encrypt(params).promise();

        // store encrypted data as base64 encoded string
        return CiphertextBlob.toString('base64');
    }

    static async decrypt(plainText) {
        const params = {
            CiphertextBlob: Buffer.from(plainText, 'base64'),
        };
        const { Plaintext } = await kms.decrypt(params).promise();
        return Plaintext.toString();
    }
}
