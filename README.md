# mid-project-227261374

## Thành viên:

1. [Phạm Thị Thuỳ Dung]
2. [Ngô Thị Phương Hoa]
3. [Nguyễn Hoàng Điệp]

# Đề tài: Trò Chơi Đoán Hình - Multiplayer
---
## Tổng Quan:

Dự án này phát triển trò chơi đoán hình nhiều người chơi theo phòng, nơi người chơi lần lượt vẽ và đoán câu trả lời. Trò chơi có hệ thống tính điểm dựa trên thời gian.

---
## TIẾN ĐỘ
7/11/2024

$\color{lime}\Large{{\textbf{Đã hoàn thành}}}$
  - ***Đăng nhập***
  - ***Tạo mới phòng***
  - ***Tham gia*** phòng từ đầu
  - ***Tham gia*** phòng trong giai đoạn ***trò chơi đã bắt đầu*** 
    - Tiến trình được cập nhật theo trạng thái của phòng hiện tại
    - Cập nhật thêm turn vẽ khi có người mới tham gia
  - ***Vẽ realtime*** :
    - Hiển thị màn hình vẽ cho tất cả client
    - Chỉ người được chọn vẽ cho turn mới được vẽ, các client khác không được chỉnh sửa
  - ***Nhắn tin*** realtime: trong phòng
  - ***Trả lời*** trong mỗi turn vẽ
  - ***Bắt đầu*** tiến trình chơi
    - Người chủ phòng có thể bắt đầu chơi khi có từ 2 thành viên trở lên
    - Mỗi turn vẽ sẽ chọn bất kỳ 1 người
    - Thời gian vẽ cho mỗi turn là 15-20s
    - Kết thúc mỗi turn sẽ hiển thị đáp án
    - Chọn người vẽ tiếp theo và bắt đầu turn vẽ mới
  - ***Tính điểm***:
    - Mỗi câu trả lời đúng sẽ được cộng thểm điểm
    - Cập nhật trạng thái điểm cho tất cả client
  
$\color{red}\Large{{\textbf{Chưa hoàn thành}}}$
  - ***Tổng kết khi kết thúc game***
  - ***Chỉnh sửa giao diện đẹp hơn***

---


## Tính Năng Chính:

1. **Vẽ và Đoán**:
   - Mỗi phòng tối đa 10 người
   - Chọn bất kỳ 1 người để vẽ, những người còn lại đoán.
   - Chọn bất kỳ 1 từ khóa để vẽ
   - Đoán đúng sẽ kết thúc lượt vẽ và số điểm tăng lên, câu trả lời đúng được ẩn
  

2. **Tính Điểm**:

   - Thời gian đoán là 100 giây, cứ 10 giây trừ 10 điểm nếu không đoán đúng.

3. **Tùy Chọn Trò Chơi**:
   - User có thể tạo phòng, gia nhập phòng bất kỳ, nhập mã phòng để tham gia
   - Chủ phòng chọn số ván hoặc đặt mục tiêu điểm để bắt đầu trò chơi.

4. **Quản Lý Phòng**:
   - Tạo và tham gia phòng bằng mã code.
   - Người vẽ chọn hình để đoán.
  
## Công Nghệ Sử Dụng:

- **Backend**: Node.js (xử lý logic và dữ liệu, websocket, realtime).
- **Frontend**: ReactJS (giao diện vẽ và đoán), HTML, CSS, JS, websocket


---