# Kiểm thử tương tác — đặt trang trí và phụ đề

Ngày kiểm tra: 17/08/2026.

| Luồng kiểm thử | Kết quả |
| --- | --- |
| Mở khóa phần thưởng | Khi tiến trình có đủ năm dấu ấn ký ức, tủ trang trí hiển thị đầy đủ năm hiện vật. |
| Đặt vật vào vườn | Nút **Đặt vào vườn** chuyển người chơi về bề mặt vườn và tạo hiện vật ở vị trí mặc định. |
| Căn chỉnh bằng bàn phím | Sau khi chọn hiện vật, phím mũi tên cập nhật tọa độ; thử nghiệm Đèn Hiên Mật thay đổi từ `x: 13` sang `x: 15`. |
| Tự lưu và sao lưu | Schema tiến trình V4 lưu mảng `decorations`; kiểm thử chuyển đổi và khôi phục JSON giữ lại tọa độ. |
| Phụ đề lời dẫn | Khi bấm **Hỏi Ong**, phụ đề xuất hiện theo câu, chuyển sang câu kế tiếp và giữ câu cuối cho đến khi âm thanh kết thúc. |

Kết luận: thao tác chuột/cảm ứng, bàn phím, tự lưu và phụ đề đều có luồng phản hồi hiển thị rõ trong bản xem trước.
