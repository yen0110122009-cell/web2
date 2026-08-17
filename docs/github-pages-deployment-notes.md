# Ghi chú triển khai GitHub Pages

Ngày 17-08-2026, GitHub Pages đã phục vụ bundle `index-uO5x6rEv.js` tại `/web2/` cùng các tài nguyên `garden-assets/`. Kiểm tra trực quan xác nhận route gốc hiển thị khu vườn thay vì trang 404.

Kiểm tra tiếp theo xác nhận font Fraunces đã sẵn sàng và tệp lời dẫn WAV trả `200` với MIME `audio/wav`; nút **Hỏi Ong** kích hoạt phụ đề phát thành công. Bản sửa tiếp theo sẽ đóng gói font cục bộ và thêm phản hồi lỗi tải lời dẫn để trải nghiệm không phụ thuộc vào Google Fonts hoặc trạng thái mạng riêng lẻ.

Sau bản sửa font cục bộ, Pages phục vụ `fraunces-700.ttf` với `200` và `font/ttf`, lời dẫn vẫn trả `200` với `audio/wav`, còn trang công khai đã chuyển sang bundle `index-DDptPaLd.js`. Font và âm thanh cùng được phân phối từ `yen0110122009-cell.github.io/web2/`.

Lần kiểm tra cuối trên URL công khai xác nhận nút **Hỏi Ong** chuyển trạng thái âm thanh thành **ĐANG PHÁT** và phụ đề `Ong kể · Lời mở đầu` hiển thị theo dòng đang đọc. Điều này xác nhận cả yêu cầu tải file và hành vi phát trong thao tác thực của người dùng.
