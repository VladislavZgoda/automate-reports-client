export class AuthError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "AuthError";

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class UnprocessableEntityError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "UnprocessableEntityError";

    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}
