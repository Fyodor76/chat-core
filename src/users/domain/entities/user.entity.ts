import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export interface UserEntityParams {
  id: string;
  login: string;
  passwordHash?: string;
}

export interface UserEntityDTO {
  id: string;
  login: string;
}

export class UserEntity {
  private _password: string;
  public readonly id: string;
  public readonly login: string;

  constructor(params: UserEntityParams) {
    this.id = params.id;
    this.login = params.login;
    this._password = params.passwordHash;

    this.validate();
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this._password);
  }

  getPasswordHash(): string {
    return this._password;
  }

  private validate(): void {
    if (!this.login?.trim()) {
      throw new Error('Login is required');
    }
    if (this.login.length < 3) {
      throw new Error('Login must be at least 3 characters');
    }
  }

  static async create(
    login: string,
    plainPassword: string,
  ): Promise<UserEntity> {
    if (!plainPassword || plainPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    return new UserEntity({
      id: uuidv4(),
      login,
      passwordHash,
    });
  }

  static withoutPassword(
    user: UserEntity,
  ): Omit<UserEntityParams, '_passwordHash'> {
    return {
      id: user.id,
      login: user.login,
    };
  }
}
