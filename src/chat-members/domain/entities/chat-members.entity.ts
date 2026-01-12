import { UserEntityDTO } from 'src/users/domain/entities/user.entity';

export interface ChatMembersParams {
  id: string;
  user: UserEntityDTO;
}

export class ChatMembersEntity {
  public readonly id: string;
  public readonly user: UserEntityDTO;

  constructor(params: ChatMembersParams) {
    this.id = params.id;
    this.user = params.user;
  }
}
