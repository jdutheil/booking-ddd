export interface PasswordManagerPort {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}

export const PASSWORD_MANAGER = 'PASSWORD_MANAGER';
