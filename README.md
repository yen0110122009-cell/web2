# Vườn Nhỏ Của Ong

> **Một khu vườn biết nhớ.**

Vườn Nhỏ Của Ong là trải nghiệm web tương tác kết hợp sự thư giãn của một khu vườn nhỏ, các mục tiêu sưu tầm nhẹ nhàng và một lớp bí ẩn được mở dần qua con Ong, những cây đột biến và cánh cửa không tên.

Phiên bản hiện tại dùng **React 19, TypeScript, Vite 7, Tailwind CSS 4** và vận hành hoàn toàn ở phía trình duyệt. Trạng thái tương tác gồm khu vườn, túi 12 phong bì, cánh cửa, mảnh ký ức, ngày/đêm, thời tiết và âm thanh Web Audio API được giữ trong phiên sử dụng.

| Thành phần | Vị trí | Vai trò |
|---|---|---|
| Trải nghiệm React | `client/src/pages/Home.tsx` | Khu vườn, tương tác, âm thanh procedural và các màn hình chính. |
| Design system | `client/src/index.css` | Phong cách **Nhật ký Mật Ong**: giấy ivory, xanh rêu, mật hổ phách và mực đêm. |
| Định hướng thương hiệu | `ideas.md` | Các nguyên tắc thiết kế, giọng thương hiệu và quyết định sau kiểm tra trực quan. |
| Kịch bản & UI/UX V1–V3 | `docs/` | Lời thoại Ong, puzzle cánh cửa, hệ thống âm thanh và ký ức năm khu vực. |
| Prototype trước React | `prototype-v3/index.html` | Bản standalone V2+V3 được lưu lại để tham khảo. |

## Chạy cục bộ

```bash
pnpm install
pnpm dev
```

Để kiểm tra kiểu dữ liệu và tạo bản build production:

```bash
pnpm check
pnpm build
```

## Ngôn ngữ thiết kế

Giao diện không xem tài nguyên như HUD. Mật ong, hạt giống, túi đồ và tiến trình được thiết kế thành **dấu sáp, phong bì hạt giống và nhãn mẫu vật**. Những điểm bí ẩn dùng ngôn ngữ **mực đêm xanh-đen thấm vào giấy** với các chấm phấn hoa hổ phách, tránh neon hoặc nền đen thuần.

Các hành động chính sử dụng ngôn ngữ gần gũi: **Tưới cây**, **Hỏi Ong**, **Theo Bướm**, **Mở túi đồ** và **Chạm vào cánh cửa**. Không có một cách chơi đúng duy nhất; người dùng có thể chăm, quan sát, ghi lại hoặc giải mã tùy nhịp độ.
