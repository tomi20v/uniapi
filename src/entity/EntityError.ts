export class EntityError {
  constructor(
    readonly status: number,
    readonly error?: string
  ) {}
}
