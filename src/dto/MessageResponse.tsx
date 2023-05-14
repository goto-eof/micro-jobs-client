import Message from './Message';

export default interface MessageResponse {
  messages: Array<Message>;
  nextOffset: number;
}
