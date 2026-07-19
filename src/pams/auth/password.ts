import { compare, hash } from "bcryptjs";

const ROUNDS = 12;
const MAX_PASSWORD_LENGTH = 128;

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length > MAX_PASSWORD_LENGTH) {
    throw new Error("Password exceeds maximum length");
  }
  return hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  passwordHash: string,
): Promise<boolean> {
  if (plain.length > MAX_PASSWORD_LENGTH) return false;
  return compare(plain, passwordHash);
}
