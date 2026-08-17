# Magic Garden V1 — Hệ thống âm thanh

> Prototype V1 dùng **Web Audio API** để tạo âm thanh nền và hiệu ứng trực tiếp trong trình duyệt. Cách này giúp phiên bản HTML chạy độc lập, không cần tải file âm thanh ngoài, đồng thời giữ rõ ranh giới giữa soundtrack, ambience và SFX.

## 1. Mục tiêu âm thanh

Âm thanh của Magic Garden không nhằm tạo cảm giác “game hóa” mạnh. Nó phải giống một lớp không khí mỏng: người dùng có thể nhận ra khu vườn đang thay đổi, nhưng nếu tắt âm thanh thì trải nghiệm chăm cây vẫn hoàn chỉnh.

Soundtrack chuyển theo **trạng thái môi trường**; SFX phản hồi theo **hành động của người dùng**; âm thanh kỳ bí chỉ xuất hiện sau khi người dùng chủ động chạm vào dấu hiệu lạ. Không phát âm thanh tự động ngay khi trang tải vì trình duyệt thường chặn audio chưa được người dùng kích hoạt.

## 2. Phân lớp âm thanh

| Lớp | Vai trò | Ví dụ | Hành vi |
|---|---|---|---|
| **Soundtrack** | Nền hòa âm rất nhẹ | Pad tam giác ban ngày, sine trầm ban đêm | Chạy loop, fade khi đổi trạng thái |
| **Ambience** | Gợi môi trường | Noise lọc thấp cho mưa, nốt sao thưa | Chỉ bật theo thời tiết |
| **SFX** | Phản hồi thao tác | Tưới cây, gieo hạt, Ong bay | Ngắn, không lặp vô hạn |
| **Magic layer** | Gợi bí ẩn | Drone trầm, chuông ngược, tiếng gõ cửa | Phát sau tương tác kỳ bí |

## 3. Soundtrack theo trạng thái

| State | Tông gợi ý | Thành phần trong prototype | Cảm giác |
|---|---|---|---|
| `day` | 196 Hz nền tam giác | Một oscillator triangle mềm, volume thấp | Ấm, xanh, mở |
| `rain` | 146.83 Hz + noise lọc thấp | Oscillator sine và buffer noise low-pass | Mưa phủ lên khu vườn |
| `night` | 110 Hz + 164.81 Hz | Hai oscillator sine, chuông thưa mỗi 7.6 giây | Yên, sâu, hơi xa |
| `starry` | 130.81 Hz + 261.63 Hz | Hai oscillator sine và chime Magic mỗi 5.2 giây | Lấp lánh, có điều chưa nói |

Các tần số trên chỉ là màu âm cho prototype, không phải bản phối cuối. Khi có audio assets thật, có thể thay `Soundscape.start()` bằng các track loop tương ứng nhưng giữ nguyên API `start(type)`, `stop()` và `setVolume(value)`.

## 4. SFX theo hành động

| ID | Trigger | Thiết kế âm thanh | Âm lượng tương đối |
|---|---|---|---:|
| `plant` | Gieo hạt | Triangle pitch đi lên, rất ngắn | 0.10 |
| `water` | Tưới cây | Sine pitch đi xuống như giọt nước | 0.09 |
| `bee` | Bấm Ong hoặc cho Ong bay | Square rất ngắn, volume thấp | 0.045 |
| `success` | Ong trở về có quà | Triangle đi lên hai bậc | 0.11 |
| `softChime` | Đổi thời tiết hoặc test âm thanh | Sine hai nốt, decay dài | 0.08 |
| `rain` | Chuyển sang mưa | Sine trầm ngắn cộng noise nền | 0.045 |
| `mystery` | Xem điều kỳ lạ | Sine đi xuống, low-pass tối | 0.12 |
| `door` | Bấm cánh cửa | Triangle trầm, kéo dài, thêm chime Magic | 0.15 |

Mọi SFX đều đi qua `audio.master`, vì vậy thanh âm lượng trong Cài đặt điều khiển được cả soundtrack và hiệu ứng. Không tạo node audio mới nếu âm thanh đang tắt.

## 5. Logic bật âm thanh

Trình duyệt chỉ khởi động `AudioContext` sau một gesture như bấm nút Bật âm thanh, bấm Trồng cây hoặc bấm vào thời tiết. Prototype dùng `ensureAudio()` để resume context khi có tương tác đầu tiên.

```js
function ensureAudio() {
  if (!audio) audio = new Soundscape();
  audio.resume();
  if (state.soundEnabled) audio.start(WEATHER[state.weather].sound);
}
```

Khi người dùng tắt âm thanh, soundtrack fade về 0 thay vì dừng đột ngột. Khi đổi ngày sang đêm hoặc chuyển sang mưa, track cũ được fade out rồi track mới fade in. Điều này tránh cảm giác cắt cảnh.

## 6. UX điều khiển âm thanh

Nút loa trên topbar là điều khiển nhanh. Khi tắt, icon là `🔇`; khi bật, icon là `🔊`. Modal Cài đặt cho phép bật/tắt soundtrack và SFX cùng một thanh âm lượng. Giá trị volume được lưu trong localStorage cùng trạng thái khu vườn.

Âm thanh mặc định là tắt để tôn trọng autoplay policy và không làm người dùng bất ngờ khi mở file HTML. Khi người dùng bật, một toast giải thích ngắn: “Khu vườn đang chọn một giai điệu phù hợp.”

## 7. Sự kiện kỳ bí

Âm thanh Magic chỉ phát khi người dùng chủ động bấm **Xem điều kỳ lạ**, bấm điểm sáng, bấm Ong sau khi đã phát hiện oddity hoặc chạm vào cánh cửa. Không tự phát âm thanh hù dọa khi người dùng không tương tác.

Chuỗi đề xuất:

```text
Điểm sáng xuất hiện
  → drone sine trầm 1.1 giây
  → chime Magic rất nhẹ
  → toast “Một điểm sáng ở cuối đường”

Cánh cửa được bấm
  → tone triangle trầm kéo dài 1.3 giây
  → chime Magic ba nốt
  → lời thoại của Ong hoặc thông báo ngắn
```

Mục tiêu là tạo cảm giác “có gì đó vừa thay đổi” thay vì “đã xảy ra một jumpscare”. Người dùng vẫn có thể quay về tưới cây ngay sau đó.

## 8. Accessibility và hiệu năng

Âm thanh không được là cách duy nhất để nhận biết trạng thái. Mưa vẫn đổi màu nền và nhãn thời tiết; sự kiện Magic vẫn xuất hiện trong toast và Nhật ký. Người dùng bật `prefers-reduced-motion` vẫn nghe được âm thanh bình thường, nhưng có thể tắt độc lập.

Prototype tạo buffer noise dài hai giây cho mưa và loop trong bộ nhớ. Khi dừng, node được fade và giải phóng sau một khoảng ngắn. Khi thay bằng audio file thật, nên dùng OGG hoặc MP3 nén nhẹ, preload track ngày/đêm và chỉ tải ambience khi cần.

## 9. Hướng nâng cấp sau prototype

V1 có thể giữ Web Audio API để kiểm chứng nhịp điệu. Khi có art direction ổn định, nhóm có thể thay từng lớp bằng asset thật:

| Giai đoạn | Asset đề xuất |
|---|---|
| V1.1 | Một loop ngày, một loop đêm, một loop mưa |
| V1.2 | Bản starry riêng và tiếng Ong bay thu thật |
| V2 | Jingle nhận quest, nhận mật ong và mở khu vực |
| Magic | Drone cửa, tiếng gõ, motif ba nốt cho ba manh mối |

API của prototype đã tách `Soundscape` và `playSfx(name)` để việc thay nguồn âm thanh không yêu cầu sửa toàn bộ event handler của giao diện.
