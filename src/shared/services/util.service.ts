import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class UtilService {
  static genPasswordSync(passwordLength: number, saltRound = 15): string {
    const salt = bcrypt.genSaltSync(saltRound);

    const password = crypto.randomBytes(passwordLength).toString('hex');

    return bcrypt.hashSync(password, salt);
  }

  static removeAccents(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }
}
