export enum Sender {
  USER = 'USER',
  BOT = 'BOT',
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  imageUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}
