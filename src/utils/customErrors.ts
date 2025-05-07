export class AuthError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "AuthError";

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class UnprocessableSimsFileError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "UnprocessableSimsFileError";

    Object.setPrototypeOf(this, UnprocessableSimsFileError.prototype);
  }
}

export class UnprocessablePiramidaFileError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "UnprocessablePiramidaFileError";

    Object.setPrototypeOf(this, UnprocessablePiramidaFileError.prototype);
  }
}

export class UnprocessableMeterReadingsError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "UnprocessableMeterReadingsError";

    Object.setPrototypeOf(this, UnprocessableMeterReadingsError.prototype);
  }
}

export class UnprocessableCurrentMeterReadingsError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "UnprocessableCurrentMeterReadingsError";

    Object.setPrototypeOf(
      this,
      UnprocessableCurrentMeterReadingsError.prototype,
    );
  }
}

export class UnprocessableReportNineError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "UnprocessableReportNineError";

    Object.setPrototypeOf(this, UnprocessableReportNineError.prototype);
  }
}

export class UnprocessableOneZoneMetersError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "UnprocessableOneZoneMetersError";

    Object.setPrototypeOf(this, UnprocessableOneZoneMetersError.prototype);
  }
}
