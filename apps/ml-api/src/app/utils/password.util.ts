import bcrypt from 'bcrypt';

export class PasswordUtil {
    static async generate(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(4);
        return await bcrypt.hash(password, salt);
    }

    static async verify(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
