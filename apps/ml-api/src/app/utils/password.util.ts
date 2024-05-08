import { hash, compare, genSalt } from 'bcryptjs';

export class PasswordUtil {
    static async generate(password: string): Promise<string> {
        const salt = await genSalt(4);
        return await hash(password, salt);
    }

    static async verify(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }
}
