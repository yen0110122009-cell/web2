# Magic Garden V3 — Câu đố giải mã Cánh cửa

## Mục tiêu trải nghiệm

Ở V2.5, người chơi thu thập năm manh mối để khiến cánh cửa thức dậy. Sang V3, cánh cửa không mở bằng một nút hoặc một nhiệm vụ tuyến tính. Người chơi phải ghép những điều đã quan sát thành một chuỗi giải mã ngắn, có thể thử lại nhưng không tạo cảm giác thất bại nặng nề.

> Cánh cửa không hỏi người chơi có đủ sức mạnh hay không. Nó hỏi người chơi có thật sự quan sát khu vườn hay chưa.

## Điều kiện mở puzzle

Puzzle hiển thị khi người chơi đã có đủ năm manh mối V2.5 và đã nuôi Cây Không Tên. Các manh mối vẫn được giữ nguyên để bảo đảm continuity:

| Manh mối | Ý nghĩa khi giải mã |
|---|---|
| Ký hiệu Trăng | Rune đầu tiên: biểu tượng mặt trăng |
| Con số 03 | Gợi ý ba tiếng gõ và con số trong mã số |
| Mảnh giấy không người gửi | Gợi ý rằng thứ tự phải được đọc, không phải đoán ngẫu nhiên |
| Viên đá đã dịch chuyển | Xác nhận người chơi phải quay lại quan sát |
| Dấu ấn của Ong | Rune cuối: biểu tượng con Ong |

## Ba tầng giải mã

### Tầng 1 — Chuỗi ký hiệu

Người chơi chọn ba rune theo thứ tự **Trăng → Con số → Ong**. Đây là thứ tự được suy ra từ nhật ký: khu vườn thức dưới trăng, Sunflower Star gõ ba tiếng, sau đó Ong nói rằng nó từng đứng ở phía bên kia.

Một lựa chọn sai không khóa puzzle. Chuỗi sẽ trở về rỗng, số lần thử tăng một và hệ thống phát SFX sai nhẹ. Giao diện chỉ nói: “Ký hiệu trượt khỏi vị trí.”

### Tầng 2 — Mã ba số

Sau chuỗi rune đúng, người chơi nhập mã **1–3–2**. Ba chữ số tương ứng với ba quan sát được ghi trong sổ tay: một vòng trăng, ba tiếng gõ, hai lần Bướm bay qua hồ. Mã được nhập bằng keypad lớn, không có giới hạn thời gian.

Nếu nhập sai, giao diện xóa mã và thêm một câu gợi ý ngắn. Sau ba lần sai, Ong mở thêm gợi ý nhưng không giải đáp thay người chơi.

### Tầng 3 — Nhịp mở cửa

Sau khi giải đúng hai tầng, người chơi phải bấm “Đặt tay lên khóa” trong **đêm có mưa**. Đây là bước xác nhận rằng người chơi hiểu cánh cửa không chỉ phản ứng với ký hiệu mà còn phản ứng với trạng thái sống của khu vườn.

Khi đúng điều kiện, cánh cửa mở, puzzle đánh dấu hoàn thành, âm thanh chuyển sang hợp âm mở cửa và nhật ký ghi lại: “Phía bên kia không phải là một căn phòng.”

## State model

```js
state.doorPuzzle = {
  runeInput: [],
  digitInput: [],
  step: 0,
  attempts: 0,
  solved: false
};
```

`step` nhận các giá trị `0` cho chuỗi rune, `1` cho mã số và `2` cho nhịp mở cửa. `solved` là cờ cuối cùng và phải được lưu trong `localStorage`.

## Quy tắc accessibility

Rune và keypad đều là button thật, có nhãn `aria-label`, thứ tự tab tự nhiên và phản hồi bằng văn bản ngoài màu sắc. Puzzle không phụ thuộc vào âm thanh để giải được; âm thanh chỉ củng cố phản hồi. Người dùng có thể đóng modal, quay lại vườn và tiếp tục sau.

## Ma trận kiểm thử

| Tình huống | Kết quả mong đợi |
|---|---|
| Chưa đủ năm manh mối | Cửa hiển thị trạng thái khóa và không mở puzzle |
| Đủ manh mối nhưng chưa có Cây Không Tên | Cửa báo còn thiếu điều kiện |
| Chọn rune sai | Xóa chuỗi, tăng attempts, phát SFX sai |
| Chọn rune đúng | Chuyển sang keypad |
| Nhập mã sai | Xóa mã, giữ ở tầng 2 và đưa gợi ý |
| Nhập `132` | Chuyển sang tầng 3 |
| Tầng 3 nhưng ban ngày/nắng | Không mở, nhắc cần đêm có mưa |
| Tầng 3, đêm có mưa | `solved=true`, cửa mở và ghi nhật ký |
| Reload trang sau khi giải | Cửa vẫn ở trạng thái đã mở |
