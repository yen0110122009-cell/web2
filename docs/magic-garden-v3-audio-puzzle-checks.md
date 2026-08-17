# V3 puzzle & V2 audio kiểm tra bước đầu

Ngày kiểm tra: 2026-08-17.

Prototype tải thành công từ server local `4174`. Giao diện hiển thị nhãn `v3 puzzle`, thẻ `V3 · Puzzle`, trạng thái mưa ban đêm, thẻ Cánh cửa, các ô cây, Ong và Bướm. DOM có các nút chính `door-btn`, `stage-door`, `clue-btn`, `sound-btn`, `weather-btn` và `time-btn`.

Đã chạy kiểm tra trạng thái thử nghiệm bằng localStorage: đặt năm manh mối `moon`, `number`, `paper`, `stone`, `bee`, đặt một plot thành biến thể `nameless`, reset puzzle về tầng 1 và reload trang. Kết quả seed state được chấp nhận, sẵn sàng kiểm tra chuỗi rune và keypad ở bước tiếp theo.

Ghi chú: browser screenshot là ảnh có đánh dấu vùng tương tác tự động; các khung vàng không phải thành phần UI của prototype.

## Kết quả modal puzzle

Sau khi seed trạng thái đủ điều kiện, nút `Cánh cửa 5/5` chuyển sang `Có thể giải mã`. Click mở modal `Giải mã Cánh cửa`, tầng 1 hiển thị chuỗi ba ô trống và ba nút rune: Trăng, Ba tiếng gõ, Ong. DOM đã render đúng các hook `data-rune`, nút đóng và trạng thái lần thử.

Ảnh trình duyệt có khung vàng là lớp đánh dấu tương tác tự động, không phải lỗi chữ hay thành phần của UI.

## Kết quả chuỗi rune

Đã chọn lần lượt `Trăng` → `Ba tiếng gõ` → `Ong`. Modal hiển thị đúng chuỗi đã chọn, toast xác nhận `Chuỗi ký hiệu đúng`, sau đó chuyển sang tầng 2 với keypad số 1–9, 0, xóa và đóng. Đây là bằng chứng luồng puzzle state chuyển từ `step: 0` sang `step: 1`.

## Kết quả keypad và điều kiện môi trường

Đã nhập mã `132`. Toast `Mã được nhận` xuất hiện và modal chuyển sang tầng 3. Tầng cuối hiển thị điều kiện `Mưa ban đêm · cần đêm có mưa` cùng nút `Chạm vào khóa`, chứng minh puzzle đã nối đúng với `environmentKey()` của Audio/Environment Engine.

## Kết quả mở cửa

Đã bấm `Chạm vào khóa` khi `weather: rain` và `time: night`. UI hiển thị `Cánh cửa đã mở`, nhật ký thêm sự kiện mở cửa và lời nhắc: `Phía bên kia không phải là một căn phòng.`

Đọc lại localStorage xác nhận: `doorSolved: true`, `clues.length: 5`, `weather: rain`, `time: night`. Audio đang tắt trong phiên kiểm tra (`sound: false`) để tránh autoplay; khi bật thủ công, Audio Engine sẽ dùng environment key `night-rain`.
