# Study Quest — Nhật ký hành trình của Ong

Study Quest là một web app học tập **local-first**. Toàn bộ dữ liệu học của bạn được lưu trong `localStorage` của trình duyệt; ứng dụng không yêu cầu tài khoản, máy chủ hay cơ sở dữ liệu.

## Mở ứng dụng

Tải hoặc sao chép tệp `index.html`, rồi mở trực tiếp bằng một trình duyệt hiện đại như Chrome, Edge, Firefox hoặc Safari. Bạn không cần cài Node.js và cũng không cần chạy máy chủ cục bộ.

> Khi mở trực tiếp bằng tệp, mỗi trình duyệt hoặc thiết bị sẽ có vùng dữ liệu localStorage riêng. Hãy dùng chức năng **Xuất JSON** trong Nhật ký để cất bản sao hành trình học.

## Các nhóm tính năng

| Nhóm | Có trong bản HTML |
|---|---|
| Học nhanh | Pomodoro 5–60 phút, thời lượng tùy chỉnh, chu kỳ nghỉ, No Score và Comeback nhẹ nhàng |
| Gợi ý học | Gợi ý cho hôm nay dựa trên dấu vết học cục bộ, không tự suy diễn khi thiếu dữ liệu |
| Học sâu | Mảnh kiến thức, trạng thái nhớ, bản đồ lỗ hổng theo môn và lý do sai |
| Quest | Hành trình năm chặng, quest sửa lỗ hổng/thử thách và XP chỉ nhận khi có bằng chứng học |
| Comfort | Audio Center nghe thử, hồ sơ local-first, giảm chuyển động và lời thoại mascot có thể tắt |
| Mascot | Tải ảnh, cắt tròn, bộ sưu tập tối đa ba mascot và khung trạng thái học |
| Dữ liệu | Nhật ký phản chiếu, export/import JSON và nhắc sao lưu nhẹ nhàng |

## Quy tắc dữ liệu

- Ứng dụng không tạo sẵn dữ liệu học hoặc kết luận về năng lực của người dùng.
- XP không được cộng ở chế độ Học nhẹ, các phiên dưới bốn phút, hoặc Quest chưa có ghi chú tự xác nhận.
- Các insight chỉ dùng điều mà người dùng đã ghi lại trong trình duyệt.

## Kiểm tra thủ công

Tệp `QA.md` ghi nhận các luồng đã được kiểm tra khi mở tệp trực tiếp qua `file://`, gồm điều hướng, localStorage, Học sâu, Quest, Nhật ký, Audio Center, hộp hồ sơ và giao diện điện thoại.
