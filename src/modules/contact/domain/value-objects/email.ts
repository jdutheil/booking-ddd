export class Email {
  private readonly email: string;

  constructor(email: string) {
    this.ensureIsValidEmail(email);
    this.email = email;
  }

  private ensureIsValidEmail(email: string): void {
    if (!this.isEmailValid(email)) {
      throw new Error('Invalid email');
    }
  }

  private isEmailValid(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.email;
  }
}
