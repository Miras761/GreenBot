
export enum Sender {
  USER = 'USER',
  BOT = 'BOT',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
}
