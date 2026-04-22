import * as argon2 from 'argon2';

export async function makePasswordHash(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  if (passwordHash.length === 0) {
    return false;
  }
  return await argon2.verify(passwordHash, password);
}
