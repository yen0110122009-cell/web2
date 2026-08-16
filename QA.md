# Kiểm tra Study Quest HTML độc lập

- Tệp `study-quest-standalone.html` đã mở trực tiếp bằng giao thức `file://` mà không cần máy chủ ứng dụng.
- Dashboard hiển thị đầy đủ điều hướng, Pomodoro, localStorage, mascot mặc định và khung trạng thái ban đầu.
- Điều hướng sang **Học sâu** hoạt động; thêm chủ đề “Định luật Charles” đã cập nhật bộ não hôm nay và chọn được chủ đề trong biểu mẫu lỗi.
- Hộp thoại **Mascot của Ong** mở được, gồm tải ảnh PNG/JPG/WebP, bộ sưu tập tối đa ba ảnh và nút trở về mascot mặc định.

Tệp không phát sinh lỗi trên bảng điều khiển trình duyệt trong các luồng đã kiểm tra. Ảnh chụp ở kích thước 390×844 xác nhận thanh điều hướng chuyển thành biểu tượng gọn, phần giới thiệu, mascot và bốn điểm bắt đầu học không bị tràn ngang hay chồng lấp.

## Nâng cấp roadmap 1 → 4

- Đã mở trực tiếp bản HTML nâng cấp qua `file://` sau khi sửa lỗi cú pháp tại Audio Center; console không còn lỗi.
- Trang Tổng quan hiển thị gợi ý học tiếp theo, preset 5/15/25/45/50/60 phút, thời lượng tùy chỉnh, chu kỳ nghỉ và Audio Center.
- Điều hướng Học sâu hiển thị mảnh kiến thức, trạng thái nhớ, bản đồ lỗ hổng theo môn và form ghi lý do sai.
- Điều hướng Quest hiển thị hành trình năm chặng, quy tắc XP theo bằng chứng và quest mở đầu; Nhật ký hiển thị phản chiếu và nhắc sao lưu local-first.

## Kiểm chứng bổ sung trước khi xuất GitHub

- Đã mở hộp **Hồ sơ local-first**, xác nhận có trường tên/môn/mục tiêu/phiên ưa thích/thời gian học và công tắc lời thoại mascot cùng Reduce Motion.
- Đã chọn **Mưa nhẹ** trong Audio Center và chạy thao tác **Nghe thử**; console không ghi nhận lỗi runtime.
- Đã xác minh trong mã nguồn: bản đồ lỗ hổng chỉ dùng các chủ đề người học tự đánh dấu dễ quên; phản chiếu lưu hai trường “Đã học” và “Nhận ra”.
- Đã xác minh Quest: nhánh sửa lỗ hổng tạo từ lỗi đã ghi, nhánh thử thách tạo từ chủ đề nắm vững, quest bí mật chỉ mở sau ba phiên; mỗi Quest yêu cầu người học tự ghi một dòng trước khi được tính.
- Đã xác minh quy tắc XP: phiên dưới bốn phút và Học nhẹ không cộng XP; Quest chỉ ghi XP sau khi có ghi nhận của người học.
- Đã xác minh nhắc sao lưu: tính số ngày từ `backupAt`, hiển thị lời nhắc khi chưa sao lưu hoặc quá 14 ngày; thao tác Xuất JSON cập nhật mốc sao lưu.
