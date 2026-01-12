// Enum с возможными значениями отправителя сообщения
export enum Sender {
  USER = 'user',
  OPERATOR = 'operator',
  BOT = 'bot',
  GUEST = 'guest',
}

// Тип, объединяющий все значения enum Sender
export type SenderType = (typeof Sender)[keyof typeof Sender];
