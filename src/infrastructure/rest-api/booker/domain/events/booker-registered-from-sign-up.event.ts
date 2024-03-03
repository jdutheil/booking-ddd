export class BookerRegisteredFromSignUpEvent {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
