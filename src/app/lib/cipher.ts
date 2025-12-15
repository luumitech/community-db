import crypto from 'crypto';
import { env } from '~/lib/env/server-env';

export class Cipher {
  private key: Buffer;
  private iv: Buffer;

  /**
   * Create a Encryption/Decryption logic using AES-256
   *
   * @param key 32-byte key
   * @param iv 16-byte Initialization vector
   */
  constructor(key: string, iv: string) {
    this.key = Buffer.from(key, 'base64');
    this.iv = Buffer.from(iv, 'base64');
  }

  static fromConfig() {
    return new Cipher(env('CIPHER_KEY'), env('CIPHER_IV'));
  }

  /** Encrypt message */
  encrypt(message: string) {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  /** Decrypt message */
  decrypt(encrypted: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Obfuscate a string by replace all characters except the first x and last y
   * characters
   *
   * @param message Message to obfuscate
   * @param first Keep the initial `first` characters unchanged
   * @param last Keep the last `last` characters unchanged
   */
  decryptAndObfuscate(encrypted: string, first: number, last: number) {
    const msg = this.decrypt(encrypted);
    if (msg.length <= first + last) {
      // Not enough characters to obfuscate, obfuscate whole string
      return '*'.repeat(msg.length);
    }

    const head = msg.slice(0, first);
    const tail = last ? msg.slice(-last) : '';
    const middle = '*'.repeat(msg.length - first - last);

    return `${head}${middle}${tail}`;
  }
}
