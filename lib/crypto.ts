import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function getKey(): Buffer {
  const secret = process.env.CREDENTIAL_ENCRYPTION_KEY;
  if (!secret || secret.length < 32) {
    throw new Error('CREDENTIAL_ENCRYPTION_KEY must be set and at least 32 characters.');
  }
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptApiKey(apiKey: string): { encryptedApiKey: string; keyIv: string; keyTag: string } {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(apiKey, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encryptedApiKey: encrypted.toString('hex'),
    keyIv: iv.toString('hex'),
    keyTag: tag.toString('hex')
  };
}

export function decryptApiKey(encryptedApiKey: string, keyIv: string, keyTag: string): string {
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(keyIv, 'hex'));
  decipher.setAuthTag(Buffer.from(keyTag, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedApiKey, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}
