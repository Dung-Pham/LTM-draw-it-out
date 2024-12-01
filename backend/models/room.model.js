export class Room {
  constructor(
    roomId,
    name,
    status,
    wss = [],
    playTimes = 0,
    keyword = "keyword",
    adminId,
    isDraw = false,
    count
  ) {
    this.roomId = roomId;
    this.users = [];
    this.name = name;
    this.status = status;
    this.wss = wss;
    this.keyword = keyword;
    this.playTimes = playTimes;
    this.adminId = adminId
    this.isDraw = isDraw
    this.count = count
  }
}
