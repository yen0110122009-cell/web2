# Magic Garden V2 — Soundtrack & SFX

## Nguyên tắc

Âm thanh của V2 được thiết kế theo lớp. Một lớp nền môi trường chạy liên tục, một lớp thời tiết được thêm hoặc tắt theo mưa, và các SFX ngắn phản hồi hành động. Mỗi trạng thái phải có bản sắc riêng nhưng chuyển tiếp đủ mềm để người dùng không cảm thấy đang đổi màn hình.

## Bốn trạng thái môi trường

| Trạng thái | Soundtrack nền | Lớp ambience | SFX nổi bật | Cảm xúc |
|---|---|---|---|---|
| Ngày nắng | Hợp âm tam giác 196–247 Hz, thưa và sáng | Gió nhẹ, vài nốt chim | Gieo hạt, tưới nước, Ong | An toàn, trong trẻo |
| Đêm yên | Hợp âm sine 110–147 Hz, chậm hơn | Gió thấp, khoảng lặng dài | Chuông xa, Bướm, manh mối | Tĩnh lặng, tò mò |
| Mưa ban ngày | Nền ngày giảm cao độ và âm lượng | Noise mưa lọc thấp, giọt nước ngắn | Tưới cây, giọt mưa, đột biến | Được chăm sóc, giàu thử nghiệm |
| Mưa ban đêm | Nền đêm + drone 82 Hz | Mưa dày hơn, gió thấp | Cửa, rune, mã đúng/sai | Thiêng, bí mật, có nguy cơ |

## Quy tắc chuyển trạng thái

Khóa trạng thái được tính bằng `weather === "rain" ? "rain" : "clear"` kết hợp với `time === "night" ? "night" : "day"`. Khi khóa thay đổi, Audio Engine giảm gain lớp cũ trong khoảng 0,8 giây, thay node oscillator/noise và tăng lớp mới. Không tạo thêm lớp nếu khóa không đổi.

Âm thanh phải bắt đầu sau một thao tác có chủ ý của người dùng, chẳng hạn bật nút âm thanh hoặc tưới cây. Đây là lý do `AudioContext` được tạo lazy trong `ensureAudio()`.

## SFX map

| Event | SFX |
|---|---|
| `plant` | Hai nốt tam giác ngắn đi lên |
| `water` | Sweep sine đi xuống, nhẹ như giọt nước |
| `bee` | Hai nhịp rung thấp |
| `butterfly` | Chuỗi chime cao, nhỏ |
| `magic` | Sweep sine chậm đi xuống |
| `door` | Hai nốt trầm mở rộng |
| `puzzle-step` | Nốt xác nhận mỗi tầng |
| `puzzle-wrong` | Hai nốt lệch nhẹ, ngắn |
| `door-open` | Hợp âm năm nốt đi lên |
| `rain` | Giọt nước ngẫu nhiên có gain thấp |

## UX điều khiển

Nút loa trên header bật/tắt toàn bộ soundtrack và SFX. Cài đặt cho phép chỉnh volume master. Tắt âm thanh không tắt animation, toast hoặc khả năng giải puzzle. Khi `prefers-reduced-motion` được bật, các animation hình ảnh giảm nhưng audio vẫn giữ nguyên trừ khi người dùng tắt.

## Hướng nâng cấp bằng audio assets thật

Prototype dùng Web Audio API để không phụ thuộc file nhị phân. Khi có audio assets, giữ nguyên interface `setEnvironment()`, `tone()` và `play()` rồi thay từng lớp oscillator bằng `AudioBufferSourceNode`, loop qua `GainNode` riêng và crossfade bằng `setTargetAtTime()`. Các event name trong bảng trên là API ổn định để thay asset mà không sửa UI.
