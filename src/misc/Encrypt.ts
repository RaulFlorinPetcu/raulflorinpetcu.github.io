import bcrypt from 'bcrypt';

export class Encrypt {

    static async cryptPassword(password: string) {
        return bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash)
    }

    static async comparePassword(password: string, hashPassword: string) {
        return bcrypt.compare(password, hashPassword)
        .then(resp => resp)
    }
}