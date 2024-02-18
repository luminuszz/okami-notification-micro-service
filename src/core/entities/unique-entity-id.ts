import { randomUUID } from 'crypto';

export class UniqueEntityID {
  private readonly _value: string;

  constructor(id?: string) {
    this._value = id ? id : randomUUID();
  }

  get value(): string {
    return this._value;
  }

  toValue() {
    return this._value;
  }

  public equals(id?: UniqueEntityID): boolean {
    return this._value === id?.value;
  }

  public toEntity() {
    return this;
  }
}
