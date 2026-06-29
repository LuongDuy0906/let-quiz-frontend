# LetQuiz - Frontend Giao Diện Trò Chơi Trắc Nghiệm Tương Tác

Giao diện người dùng (Frontend) của hệ thống **LetQuiz** được xây dựng trên nền tảng **Next.js (App Router)** và **React**, cung cấp giao diện thời gian thực mượt mà cho cả giáo viên (Host) điều phối và học sinh (Player) tham gia trò chơi trắc nghiệm.

---

## Các Tính Năng Nổi Bật

### 1. Phong Cách Thiết Kế Retro-Brutalism Độc Đáo

- Sử dụng bảng màu cá tính, các khối hộp viền đen dày (`border-4 border-black`), đổ bóng cứng (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`) tạo cảm giác hiện đại, trẻ trung và thu hút người chơi.
- Bố cục responsive hoàn chỉnh, tối ưu hiển thị trên các thiết bị di động (Học sinh chơi game) và màn hình máy tính lớn (Giáo viên trình chiếu).

### 2. Phòng Chờ Thời Gian Thực (Lobby)

- Người chơi tham gia phòng bằng mã PIN và tự tạo hồ sơ đấu sĩ:
  - Nhập biệt danh tùy chọn.
  - Thay đổi ngoại hình ngẫu nhiên (Avatar) kết nối API **Dicebear (Bottts)** sinh động.
- Cập nhật danh sách người chơi trong phòng chờ tức thời bằng kết nối Socket.
- Host cấu hình trò chơi trực quan (xáo trộn câu hỏi, xáo trộn đáp án, ẩn/hiện bảng xếp hạng).

### 3. Bộ Trình Diễn Đấu Trường (Quiz Play Engine)

- Giao diện đếm ngược thời gian thông minh: Hiển thị điểm số giảm dần theo thời gian (giảm dần từ 1000 về 500 điểm khi hết giờ) thay vì hiển thị giây đếm ngược đơn thuần, kích thích tính cạnh tranh của người chơi.
- Nhận dạng và hiển thị hình ảnh minh họa cho câu hỏi trắc nghiệm một cách sắc nét.
- Xử lý tương tác chọn đáp án, tự động border xanh lá đối với đáp án đúng và border đỏ với các lựa chọn sai khi hết giờ.
- Hiển thị bảng xếp hạng trực tiếp (Live Leaderboard) cập nhật sau mỗi câu hỏi.

### 4. Quản Lý & Xuất Báo Cáo Kết Quả (Reports)

- Giao diện tổng kết (Summary) của Host hiển thị chi tiết bảng xếp hạng chung cuộc, thống kê điểm số và số câu trả lời đúng của từng người tham gia.
- **Xuất báo cáo CSV**: Cho phép Host tải về báo cáo kết quả chi tiết của phòng đấu chỉ bằng một cú nhấp chuột (hệ thống tự động phân tách cột rõ ràng, loại bỏ avatar không cần thiết để tối ưu hóa việc phân tích dữ liệu trên Excel/Google Sheets).

---

## Yêu Cầu Hệ Thống

- **Node.js** >= 18.x
- **npm**, **yarn**, hoặc **pnpm**

---

## Hướng Dẫn Cài Đặt

### 1. Tải Mã Nguồn & Cài Đặt Dependencies

```bash
# Clone repository
git clone https://github.com/LuongDuy0906/let-quiz-frontend.git

# Di chuyển vào thư mục dự án
cd let-quiz-frontend

# Cài đặt thư viện
npm install
```

### 2. Cấu Hướng Biến Môi Trường (.env.local)

Tạo file `.env.local` ở thư mục gốc của dự án:

```bash
touch .env.local
```

Cấu hình các biến kết nối tới API và Socket Server của Backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 3. Khởi Chạy Ứng Dụng

**Chạy chế độ phát triển (Development):**

```bash
npm run dev
```

Sau đó mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000) để kiểm tra.

**Biên dịch & Chạy Production:**

```bash
# Biên dịch
npm run build

# Khởi chạy production server
npm run start
```

---

## Cấu Trúc Thư Mục Frontend

```
src/
├── app/                    # Routing & Pages sử dụng Next.js App Router
│   ├── (auth)/            # Các trang Đăng ký / Đăng nhập / Xác thực
│   ├── (game-session)/    # Màn hình phòng chờ [roomPin] và màn hình chơi game /play
│   ├── (main)/            # Các màn hình chính (Trang chủ, Quản lý bộ câu hỏi)
│   ├── layout.tsx         # Layout cấu trúc chính
│   └── page.tsx           # Trang chủ ứng dụng
├── component/             # Các component React tái sử dụng
│   ├── editor/            # Trình soạn thảo và chỉnh sửa bộ câu hỏi (Quiz Editor)
│   ├── game-session/      # Lobby, Màn hình chơi game (QuizPlayEngine), Form tạo hồ sơ đấu sĩ
│   └── ui/                # Các thành phần giao diện nhỏ dùng chung (Button, Input, Card)
├── features/              # Các hàm service kết nối API & xử lý logic nghiệp vụ
│   └── game-session/      # Tích hợp API và logic Socket Client
├── providers/             # React Context Providers quản lý trạng thái toàn cục
│   ├── socket.provider.tsx # Quản lý kết nối Socket.io-client & truyền tải Token
│   └── user.provider.tsx   # Quản lý trạng thái và thông tin tài khoản người dùng đăng nhập
├── lib/                   # Cấu hình Fetch Client, Axios hoặc các hàm Helper bổ trợ
└── styles/                # Stylesheets của hệ thống
```

---

## Các Công Nghệ Sử Dụng

- **Next.js & React 18**
- **Socket.io-client** (Hỗ trợ bắt tay kết nối kèm Token JWT bảo mật)
- **Tailwind CSS** (Hệ thống thiết kế phong cách Brutalism tùy chỉnh)
- **Lucide React** (Bộ icons chất lượng cao)
