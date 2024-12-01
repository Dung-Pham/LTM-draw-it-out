export class User {
  constructor(
    userId,
    name,
    isEdit = false,
    diem = 0,
    status,
    message = "",
    isAdmin = false,
    canAnswer = true
  ) {
    this.userId = userId;
    this.name = name;
    this.isEdit = isEdit;
    this.diem = diem;
    this.status = status;
    this.message = message;
    this.isAdmin = isAdmin;
    this.canAnswer = canAnswer;
  }
}
