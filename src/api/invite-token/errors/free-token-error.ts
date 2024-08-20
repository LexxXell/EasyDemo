export class FreeTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FreeTokenError';
  }
}
