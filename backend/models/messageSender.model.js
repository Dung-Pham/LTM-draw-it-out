// export const MessageSend = {
//   type: "",
//   user: "",
//   room: "",
// };
export class MessageSend {
  constructor(type, user, room) {
    (this.type = type), (this.user = user), (this.room = room);
  }
}
