# Magic Garden V2.5 — Kịch bản cây đột biến và cánh cửa bí ẩn

## 1. Mục tiêu trải nghiệm

V2.5 không đưa ra một chuỗi nhiệm vụ bắt buộc. Nó tạo ra những **điều kiện có thể thử nghiệm**, rồi để người chơi tự nhận ra rằng thời tiết, thời gian, chất lượng chăm sóc và sự thân thiết với Ong có thể làm một cây thay đổi.

> “Cây này không giống cây hôm qua.”

Câu này là nguyên tắc kể chuyện của hệ thống đột biến. Game không nói ngay công thức. Nó chỉ cho người chơi thấy kết quả, ghi lại một phần trong Sổ tay và để lại đủ dấu hiệu để họ muốn thử lần nữa.

## 2. Trạng thái đột biến

Mỗi cây có hai lớp trạng thái. Lớp đầu tiên là tình trạng chăm sóc; lớp thứ hai là biến thể Magic. Một cây có thể khỏe nhưng chưa đột biến, hoặc đang héo nhưng vẫn giữ một hạt giống lạ.

| Nhóm | Giá trị | Ý nghĩa hiển thị |
|---|---|---|
| `health` | 0–100 | Sức khỏe tổng thể của cây |
| `water` | `thirsty`, `enough`, `soaked` | Lượng nước hiện tại |
| `growthState` | `seed`, `growing`, `blooming`, `withered` | Giai đoạn phát triển |
| `variant` | `normal`, `moonRose`, `starSunflower`, `galaxyPlant` | Biến thể Magic |
| `discoverySeen` | boolean | Người chơi đã nhìn thấy biến thể chưa |
| `mutationClues` | mảng ID | Các điều kiện đã vô tình chạm tới |

UI không hiển thị xác suất đột biến. Người chơi chỉ thấy các trạng thái dễ hiểu như **Khỏe mạnh**, **Đủ nước**, **Đang nở** và một dòng mơ hồ như **Có gì đó khác thường**.

## 3. Công thức đột biến

Một lần kiểm tra đột biến xảy ra khi cây chuyển sang trạng thái nở, hoặc khi người chơi mở lại khu vườn sau một thay đổi môi trường lớn. Prototype dùng điều kiện gần như xác định để dễ kiểm thử; bản game thật có thể thêm xác suất thấp.

```js
function canMutate(plant, world) {
  const caredFor = plant.health >= 78 && plant.water !== "thirsty";
  const moonCondition = world.weather === "rain" && world.isNight;
  const luckyCondition = world.luck >= 3 || world.beeAffinity >= 25;
  return caredFor && moonCondition && luckyCondition;
}
```

Các điều kiện không xuất hiện thành một checklist. Chúng được gợi qua thời tiết, câu thoại của Ong, biểu tượng trong Sổ tay và các phản ứng nhỏ của khu vườn.

## 4. Danh sách biến thể V2.5

| Cây thường | Biến thể | Điều kiện cốt lõi | Dấu hiệu trước khi đột biến | Phần thưởng khám phá |
|---|---|---|---|---|
| 🌹 Hoa Hồng Đỏ | 🌹🌙 **Hoa Hồng Ánh Trăng** | Trồng lúc đêm, gặp mưa, sức khỏe từ 78 trở lên | Cánh hoa phản sáng dù trời tối | Mảnh ký hiệu Trăng |
| 🌻 Hướng Dương | 🌻✨ **Sunflower Star** | Đủ ba lần chăm sóc khi có nắng, sau đó gặp đêm sao | Hoa quay về phía một ngôi sao thay vì mặt trời | Mật ong sao và manh mối Số 3 |
| 🌷 Tulip | 🌷🪞 **Tulip Gương** | Tưới đúng lúc có sương, không tưới quá mức | Mặt nước trên lá phản chiếu khu vườn khác | Mảnh giấy có hình cánh cửa |
| 🍀 Cỏ May Mắn | 🍀🌌 **Cỏ Ngân Hà** | Nhặt quà bí mật, gieo vào đêm sao, Ong thân thiết từ 25 | Hạt giống có ánh xanh rất mờ | Mở mục Hiện tượng trong Sổ tay |
| 🌿 Cây chưa ghi tên | 🌿❓ **Cây Không Tên** | Gieo hạt lạ, để tự lớn qua hai chu kỳ thời tiết | Tên cây luôn hiển thị `???` | Kích hoạt mốc cuối của cánh cửa |

## 5. Tiến trình phát hiện một biến thể

### Chương A — Điều kiện vô tình

Người chơi trồng Hoa Hồng Đỏ vào một đêm mưa. Sáng hôm sau cây vẫn có vẻ bình thường, nhưng nhãn trạng thái thay đổi từ **Khỏe mạnh** thành **Có gì đó khác thường**. Trong nhật ký xuất hiện một dòng không giải thích:

> “Lá cây vẫn ướt. Nhưng đất quanh nó khô.”

Ong chỉ nói:

> “Tôi không tưới cây này.”

### Chương B — Dấu hiệu nhìn thấy

Khi người chơi bấm vào cây vào ban đêm, một vệt sáng chạy qua cánh hoa. Không có popup lớn; chỉ có toast nhỏ:

> “Bạn vừa nhìn thấy một điều chưa được ghi trong sổ.”

Sổ tay mở thêm mục **Hiện tượng**, nhưng tên cây vẫn bị khóa.

### Chương C — Khoảnh khắc biến đổi

Khi cây đủ khỏe và gặp lại mưa đêm, animation cánh hoa chuyển từ màu đỏ sang xanh tím trong 1,2 giây. Soundscape chuyển sang một chime Magic rất nhẹ. Tên **Hoa Hồng Ánh Trăng** được ghi vào Sổ tay, nhưng điều kiện vẫn không được hiển thị đầy đủ.

### Chương D — Manh mối cho lần thử tiếp theo

Trong mô tả cây có một câu mới:

> “Nó nở khi bầu trời có hai lớp nước.”

Người chơi có thể hiểu là **mưa + đêm**, nhưng vẫn cần tự đoán phần “sức khỏe” và “may mắn”.

## 6. Manh mối mở cánh cửa

Cánh cửa không yêu cầu một mã số duy nhất. Nó phản ứng khi người chơi thu thập đủ các **dấu hiệu thuộc về khu vườn cũ**. Có năm manh mối chính; chỉ cần bốn manh mối để làm cánh cửa thức dậy, nhưng manh mối thứ năm mới tiết lộ thân phận thật của Ong.

| ID | Manh mối | Cách phát hiện | Dấu hiệu trên cánh cửa |
|---|---|---|---|
| `clue-moon` | 🌙 **Ký hiệu Trăng** | Hoa Hồng Ánh Trăng nở | Vòng tròn bên trái sáng lên |
| `clue-number` | 🔢 **Con số 03** | Sunflower Star nở vào đêm sao | Ba vết gõ vang lên |
| `clue-paper` | 📜 **Mảnh giấy không người gửi** | Tulip Gương phản chiếu hộp thư | Khe thư trên cửa mở ra |
| `clue-stone` | 🪨 **Viên đá đã dịch chuyển** | Bấm viên đá trong ba ngày khác nhau | Bóng cửa đổi hướng |
| `clue-bee` | 🐝 **Dấu ấn của Ong** | Đạt Bee Affinity 50 và cho Ong xem cây đột biến | Ong không còn xuất hiện trong gương cửa |

### Manh mối 1 — Ký hiệu Trăng

Khi Hoa Hồng Ánh Trăng nở, dưới gốc cây xuất hiện một vòng tròn nhỏ. Nếu nhặt lên, vật phẩm được ghi là `mảnh ký hiệu`. Khi đặt trong Sổ tay, người chơi thấy hình trăng khuyết giống hệt vết chạm trên cánh cửa.

Ong nói:

> “Đó không phải là ánh trăng. Ánh trăng không để lại đồ vật.”

### Manh mối 2 — Con số 03

Khi Sunflower Star mở cánh, hoa không hướng về mặt trời mà hướng về cánh cửa. Bấm vào hoa ba lần trong cùng một đêm sẽ nghe ba tiếng gõ vọng lại. Sổ tay ghi một con số duy nhất: **03**.

Ong nói:

> “Tôi đã nghe con số đó trước đây. Nhưng tôi không nhớ ở đâu.”

### Manh mối 3 — Mảnh giấy không người gửi

Tulip Gương phản chiếu một chiếc hộp thư không tồn tại ở khu vườn hiện tại. Khi người chơi bấm vào lá cây, một mảnh giấy rơi xuống. Phần người gửi chỉ có:

> “Người đang chăm sóc nơi này.”

Nội dung giấy:

> “Đừng mở cửa khi khu vườn đang gọi tên bạn.”

### Manh mối 4 — Viên đá đã dịch chuyển

Một viên đá nằm ở góc vườn. Ngày đầu bấm vào, hệ thống chỉ nói **“Không có gì xảy ra.”** Ngày tiếp theo viên đá lệch vài pixel. Ngày thứ ba xuất hiện ký hiệu giống hình cánh ong nhưng thiếu một cánh.

Ong nói:

> “Tôi không chạm vào viên đá.”

Sau một khoảng dừng:

> “Nếu tôi có chạm, tôi cũng sẽ không kể.”

### Manh mối 5 — Dấu ấn của Ong

Khi Bee Affinity đạt 50, người chơi có thể đưa Ong đến cánh cửa. Ong bay vòng quanh ổ khóa rồi đứng yên. Trong mặt cửa, hình ảnh phản chiếu của Ong bị thiếu đi phần cánh.

Ong nói:

> “Bạn thấy chưa? Tôi cũng từng đứng ở phía bên kia.”

Đây là manh mối quan trọng nhất nhưng không bắt buộc để cánh cửa thức dậy.

## 7. Các trạng thái của cánh cửa

| Trạng thái | Điều kiện | Phản ứng |
|---|---|---|
| `silent` | 0–1 manh mối | Không tương tác ngoài dòng “chưa có tên” |
| `aware` | 2 manh mối | Cửa đổi bóng vào ban đêm |
| `listening` | 3 manh mối | Có tiếng gõ khi người chơi bấm vào |
| `awake` | 4 manh mối | Ổ khóa phát sáng, Ong tránh nhìn vào cửa |
| `openable` | 5 manh mối + cây Không Tên | Hiện lựa chọn “Đặt tay lên cánh cửa” |
| `open` | Secret Ending được kích hoạt | Mở sang khu vực chưa xác định ở V3 |

Cánh cửa chỉ cho phép hành động mở ở trạng thái `openable`. Nếu người chơi bấm sớm, hệ thống không phạt mà phản hồi bằng một câu ngắn:

> “Cánh cửa chưa mở. Nhưng lần này, nó biết bạn đang ở đây.”

## 8. Kết thúc mở V2.5

Sau khi có bốn manh mối, cánh cửa bắt đầu phát sáng vào đêm sao. Người chơi có thể bấm vào nhưng chỉ thấy một khe hẹp. Từ phía bên kia vọng ra tiếng Ong, dù Ong đang đứng ngay cạnh người chơi.

> “Đừng mở. Tôi chưa tìm thấy phần còn lại của mình.”

Màn hình không chuyển khu vực. Chỉ thêm một mốc vào Lịch sử khu vườn:

> **Ngày ? — Cánh cửa đã nghe thấy bạn.**

V2.5 kết thúc ở đây, đủ để người chơi muốn quay lại nhưng không khiến V2 phải gánh toàn bộ phần Secret Ending.

## 9. Ma trận kiểm thử kịch bản

| Test | Thao tác | Kết quả mong đợi |
|---|---|---|
| M-01 | Trồng cây bình thường | Không đột biến nếu thiếu điều kiện |
| M-02 | Trồng cây lúc mưa đêm | Ghi lại clue điều kiện, chưa đột biến ngay |
| M-03 | Cây khỏe + mưa đêm + may mắn | Biến thể xuất hiện khi đủ chu kỳ |
| M-04 | Bấm cửa với 0 manh mối | Hiện phản hồi `silent` |
| M-05 | Có 2 manh mối, bấm cửa ban đêm | Cửa đổi bóng, không mở |
| M-06 | Có 4 manh mối | Cửa chuyển `awake`, ổ khóa sáng |
| M-07 | Bee Affinity 50 | Mở clue `clue-bee` và thoại đặc biệt |
| M-08 | Có đủ 5 manh mối nhưng thiếu cây Không Tên | Cửa `openable` chưa được kích hoạt |
| M-09 | Đã có cây Không Tên | Hiện hành động đặt tay lên cửa |
| M-10 | Refresh trang | Mutation, clues và door state vẫn giữ trong localStorage |
