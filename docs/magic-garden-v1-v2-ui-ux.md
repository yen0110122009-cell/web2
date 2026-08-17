# Magic Garden — Đặc tả UI/UX V1–V2

> Tài liệu này mô tả giao diện, trải nghiệm người dùng và các trạng thái tương tác cho hai phiên bản đầu tiên của **Magic Garden**. V1 xây dựng lớp **Cozy Garden**; V2 bổ sung lớp **Mini Game Garden** mà vẫn giữ cảm giác nhẹ nhàng, không biến khu vườn thành một game cày cuốc.

## 1. Phạm vi và mục tiêu sản phẩm

Magic Garden là một khu vườn local-first chạy được từ một tệp HTML. Người dùng có thể mở trang, trồng cây, chăm sóc, quan sát khu vườn thay đổi và quay lại vào những ngày khác để xem điều gì mới xuất hiện. Dữ liệu phiên bản đầu được lưu bằng `localStorage`, không yêu cầu tài khoản, máy chủ hoặc cơ sở dữ liệu.

V1 phải tạo được cảm giác: **mở vào là thấy dịu, thao tác là hiểu ngay, rời đi vẫn muốn quay lại**. V2 thêm mục tiêu ngắn hạn, kho đồ, mật ong, phần thưởng và thành tựu. Các cơ chế này chỉ làm rõ tiến trình, không đặt áp lực phải tối ưu hóa hay cạnh tranh.

| Phiên bản | Trọng tâm | Người dùng có thể làm | Cảm giác cần đạt |
|---|---|---|---|
| **V1 — First Bloom** | Cozy Garden | Trồng, tưới, chờ cây lớn, tương tác với Ong, trang trí cơ bản, lưu vườn | Bình yên, dễ tiếp cận, có sự sống |
| **V2 — The Garden Keepsake** | Cozy + Mini Game | Làm nhiệm vụ, nhận Garden EXP, dùng mật ong, quản lý kho, mở khóa thành tựu | Có mục tiêu nhẹ và lý do quay lại |

## 2. Nguyên tắc UX cốt lõi

### 2.1. Khu vườn là nơi đến, không phải danh sách việc phải làm

Màn hình chính luôn ưu tiên không gian vườn. Nhiệm vụ và thông báo chỉ xuất hiện như lời gợi ý nhỏ. Không dùng popup ép người dùng phải nhận quest, không dùng đồng hồ đếm ngược và không khóa thao tác cơ bản sau khi người dùng bỏ lỡ một ngày.

### 2.2. Một hành động chính tại một thời điểm

Ở mỗi trạng thái, giao diện chỉ nên có một CTA chính: **Trồng cây**, **Tưới cây**, **Thu hoạch**, **Nhận thưởng** hoặc **Khám phá cùng Ong**. Những thao tác phụ nằm trong kho đồ, nhật ký hoặc menu ngữ cảnh để tránh làm mặt vườn rối.

### 2.3. Phản hồi phải êm và có tính vật lý

Mọi hành động cần phản hồi bằng ít nhất một trong ba cách: chuyển động nhỏ, thay đổi hình ảnh hoặc âm thanh tùy chọn. Ví dụ, khi tưới cây, đất tối màu trong chốc lát, giọt nước rơi xuống và cây rung nhẹ. Không dùng hiệu ứng quá nhanh, quá sáng hoặc quá nhiều con số.

### 2.4. Không phạt người dùng vì nghỉ chơi

Cây không chết khi người dùng không mở web. Nếu một cây cần chăm sóc, trạng thái chỉ chuyển thành **đang chờ được chăm sóc**. V2 không dùng streak bắt buộc; nếu có ngày quay lại, người dùng có thể nhận một lời chào hoặc sự kiện nhỏ nhưng không bị trừ điểm.

### 2.5. Bí ẩn chỉ xuất hiện khi người dùng sẵn sàng

V1 không giải thích lớp Magic. Các dấu hiệu bất thường chỉ nên ở dạng rất nhẹ: một vị trí bị khóa, một ký hiệu chưa rõ nghĩa hoặc một câu thoại hơi lạ của Ong. V2 có thể cho phép người dùng ghi nhận các dấu hiệu này trong Nhật ký, nhưng chưa biến chúng thành cốt truyện bắt buộc.

## 3. Kiến trúc thông tin và điều hướng

Trên desktop, ứng dụng dùng bố cục hai vùng: thanh điều hướng dọc bên trái và vùng nội dung chính bên phải. Trên màn hình nhỏ, thanh điều hướng chuyển thành thanh tab cố định ở cạnh dưới để người dùng thao tác bằng ngón tay cái.

```text
Desktop
┌──────────────────────────────────────────────────────────────┐
│  Khu vườn của tôi                              ☀️  Ngày 01   │
├───────────────┬──────────────────────────────────────────────┤
│ 🌱 Vườn       │                                              │
│ 🎒 Kho đồ     │                  VÙNG NỘI DUNG                │
│ 🗺 Bản đồ     │                                              │
│ 📖 Nhật ký    │                                              │
│ ⚙ Cài đặt     │                                              │
└───────────────┴──────────────────────────────────────────────┘

Mobile
┌──────────────────────────────┐
│ Khu vườn của tôi       ☀️    │
├──────────────────────────────┤
│                              │
│        VÙNG NỘI DUNG         │
│                              │
├──────────────────────────────┤
│ 🌱 Vườn  🎒 Đồ  🗺 Map  📖 Sổ │
└──────────────────────────────┘
```

| Khu vực | Có trong V1 | Bổ sung trong V2 | Quy tắc hiển thị |
|---|---:|---:|---|
| **Vườn** | Có | Có | Màn hình mặc định sau khi mở ứng dụng |
| **Kho đồ** | Có, ở mức hạt giống và đồ trang trí | Có, thêm mật ong, vật phẩm nhiệm vụ | Không ẩn vì người dùng cần biết mình đang có gì |
| **Bản đồ** | Có, chỉ hiển thị mảnh vườn và các ô khóa | Có, hiển thị điều kiện mở khóa | Khu chưa mở dùng hình bóng, không lộ spoiler |
| **Nhật ký** | Có, ghi cây và sự kiện đã thấy | Có, thêm quest, thành tựu, dấu hiệu lạ | Mục chưa phát hiện hiển thị dạng silhouette |
| **Cài đặt** | Có | Có | Âm thanh, giảm chuyển động, sao lưu dữ liệu |

## 4. Design system

### 4.1. Bảng màu

Bảng màu cần giữ được chất giấy, cây cỏ và ánh sáng tự nhiên. Màu đỏ cam dùng cho CTA chính theo tinh thần giao diện hiện tại của dự án, nhưng các trạng thái khu vườn dùng xanh lá, vàng mật ong và xanh đêm để tránh cảm giác cảnh báo.

| Vai trò | Màu đề xuất | Công dụng |
|---|---|---|
| Paper | `#F8F2E6` | Nền toàn ứng dụng |
| Card | `#FFFDF8` | Thẻ và modal |
| Ink | `#342A23` | Tiêu đề, nội dung chính |
| Muted | `#756B60` | Mô tả, metadata |
| Leaf | `#3F8F68` | Thành công, trạng thái đang sống |
| Leaf soft | `#E3F4EA` | Nền trạng thái nhẹ |
| Honey | `#D5A34A` | Mật ong, phần thưởng, điểm nhấn |
| Blossom | `#D94A3D` | CTA chính và trạng thái cần chú ý |
| Night | `#2E3855` | Đêm, khu vườn đêm, dấu hiệu Magic |
| Line | `#DFD1BE` | Viền, đường phân tách |

Mọi màu chữ trên nền sáng phải đạt độ tương phản đủ để đọc được ở kích thước nhỏ. Không dùng màu làm tín hiệu duy nhất; trạng thái quan trọng cần đi kèm chữ hoặc biểu tượng có nhãn.

### 4.2. Typography và hình khối

Tiêu đề dùng serif mềm, có thể tiếp tục dùng Georgia để tương thích với HTML đơn giản. Nội dung, nút và biểu mẫu dùng system sans-serif. Bo góc từ `10px` đến `20px`, đổ bóng nhẹ, tránh giao diện bóng kính hoặc gradient mạnh. Các thẻ nên có khoảng trắng rộng và viền mảnh thay vì quá nhiều icon.

### 4.3. Trạng thái tương tác chung

| Trạng thái | Biểu hiện | Ví dụ |
|---|---|---|
| Default | Nền card sáng, viền mảnh | Hạt giống chưa chọn |
| Hover | Nâng nhẹ 2–3px, bóng rõ hơn | Hover lên chậu cây |
| Focus | Viền focus 3px có độ tương phản | Tab tới nút Tưới cây |
| Pressed | Thu nhỏ nhẹ, không đổi vị trí | Bấm nút Trồng |
| Disabled | Giảm opacity, giải thích điều kiện | Khu vực chưa mở |
| Success | Xanh lá, toast ngắn | Tưới cây thành công |
| Discovery | Vàng hoặc xanh đêm, animation chậm | Phát hiện vật phẩm lạ |

## 5. V1 — Màn hình và luồng chính

### 5.1. Onboarding lần đầu: “Một mảnh đất nhỏ”

Onboarding chỉ gồm ba bước, có thể bỏ qua. Mục tiêu là giải thích hành động đầu tiên mà không làm người dùng cảm giác đang đọc hướng dẫn dài.

**Bước 1 — Chào mừng.** Tiêu đề: “Chào mừng đến khu vườn của bạn.” Mô tả ngắn: “Bạn không cần vội. Hôm nay chỉ cần chọn một hạt giống.” CTA: **Bắt đầu trồng**.

**Bước 2 — Chọn tên vườn.** Người dùng nhập tên tùy chọn, mặc định là “Khu vườn nhỏ”. Cho phép bỏ qua để dùng tên mặc định. Giới hạn 24 ký tự, hiển thị preview trên biển gỗ nhỏ.

**Bước 3 — Chọn hạt giống đầu tiên.** Chỉ hiển thị Hướng Dương và Tulip. Mỗi thẻ có mô tả về ánh sáng, lượng nước và thời gian lớn tương đối. CTA: **Trồng hạt này**.

Sau khi hoàn tất, ứng dụng đưa người dùng thẳng tới khu vườn, tập trung thị giác vào ô đất vừa chọn. Không hiển thị toàn bộ hệ thống Kho đồ, Bản đồ và Nhật ký trong onboarding.

### 5.2. Màn hình Vườn — màn hình trung tâm

Màn hình Vườn chiếm phần lớn diện tích. Vùng vườn là một canvas hoặc container có nền minh họa, bên trên đặt các ô đất, cây, vật trang trí và sinh vật. Các đối tượng phải có vùng bấm đủ lớn, tối thiểu khoảng 44px trên mobile.

```text
┌──────────────────────────────────────┐
│ 🌱 Khu vườn của tôi       ☀️  Ngày 01 │
│ 3 cây đang lớn  ·  1 việc nhẹ hôm nay │
├──────────────────────────────────────┤
│                                      │
│       🌳                 🦋           │
│   [Tulip]       🐝                   │
│             [Hướng Dương]            │
│     🪨                 🪴             │
│                                      │
│       [ + Trồng cây ]                │
├──────────────────────────────────────┤
│ 🌱 Vườn  🎒 Kho  🗺 Bản đồ  📖 Nhật ký │
└──────────────────────────────────────┘
```

#### Thành phần bắt buộc

| Thành phần | Nội dung | Hành vi |
|---|---|---|
| Header | Tên vườn, thời tiết, ngày trong vườn | Bấm thời tiết để xem mô tả ngắn |
| Garden canvas | Ô đất, cây, vật trang trí, Ong | Bấm đối tượng để mở action sheet |
| Garden summary | Số cây đang lớn, trạng thái chăm sóc | Tóm tắt, không dùng số liệu dày đặc |
| Primary CTA | `+ Trồng cây` khi còn ô đất trống | Mở chọn hạt giống |
| Toast area | Phản hồi hành động | Tự biến mất sau 3–4 giây |
| Bottom navigation | 4 khu vực chính | Luôn cố định trên mobile |

#### Action sheet của cây

Khi bấm một cây, mở panel từ cạnh dưới trên mobile hoặc popover cạnh cây trên desktop. Panel có tên cây, giai đoạn phát triển, nhu cầu hiện tại và tối đa hai hành động chính.

```text
🌷 Tulip
Đang lớn · Giai đoạn 2/3
Thích buổi sáng · Đất hơi khô

[ 💧 Tưới cây ]       [ Xem chi tiết ]
```

Nếu cây chưa cần nước, CTA chính đổi thành **Ngắm cây** hoặc **Đóng**. Không hiển thị nút tưới như một hành động luôn luôn khả dụng để tránh thao tác thừa.

### 5.3. Màn hình Chọn hạt giống và Trồng cây

Màn hình chọn hạt giống là một modal toàn màn hình trên mobile và dialog rộng trên desktop. Mỗi hạt giống hiển thị hình minh họa, tên, độ hiếm, điều kiện và thời gian lớn tương đối. V1 chỉ cần ba đến bốn loại: Hướng Dương, Tulip, Cỏ, và một ô khóa cho tương lai.

```text
Chọn một hạt giống
┌──────────────┐ ┌──────────────┐
│ 🌻           │ │ 🌷           │
│ Hướng Dương  │ │ Tulip        │
│ Lớn nhanh    │ │ Cần chăm đều │
│ [Chọn]       │ │ [Chọn]       │
└──────────────┘ └──────────────┘
```

Sau khi chọn, người dùng quay lại Vườn với ô đất được highlight. CTA đổi thành **Đặt hạt giống vào đây**. Nếu không còn ô đất trống, giao diện đưa ra hai lựa chọn: mở khu đất mới nếu đủ điều kiện hoặc quay lại Kho đồ.

### 5.4. Màn hình Kho đồ V1

Kho đồ V1 không nên giống kho của game nhập vai. Nó giống một ngăn kéo nhỏ với ba nhóm: **Hạt giống**, **Trang trí**, **Vật phẩm khác**. Các vật phẩm được sắp xếp theo loại, sau đó theo số lượng.

Mỗi item card có icon, tên, số lượng và trạng thái có thể dùng. Khi bấm item, mở panel mô tả với một CTA rõ ràng: **Trồng**, **Đặt vào vườn** hoặc **Xem**. Không hiển thị các chỉ số không cần thiết.

### 5.5. Màn hình Bản đồ V1

Bản đồ chỉ có một vùng đang mở là **Mảnh Vườn Số 01**. Các khu khác hiển thị dưới dạng bóng mờ, có tên gợi ý nhưng chưa nêu điều kiện cụ thể. Ví dụ: “Có một nơi khác ở phía sau hàng cây.”

Bản đồ cần tạo cảm giác mở rộng mà không gây thất vọng. Khu bị khóa có thể hiển thị một dấu chấm sáng rất nhẹ hoặc một đường mòn chưa hoàn thiện, nhưng không hiện biểu tượng ổ khóa lớn ở trung tâm.

### 5.6. Màn hình Nhật ký V1

Nhật ký là nơi lưu lại những gì người dùng đã thật sự nhìn thấy. Các mục chưa phát hiện dùng silhouette và câu “Chưa gặp”. V1 có bốn tab: **Cây**, **Sinh vật**, **Ngày đã ghé**, **Điều kỳ lạ**.

Tab **Điều kỳ lạ** ban đầu gần như trống, chỉ có một dòng: “Có lẽ khu vườn chưa kể hết mọi chuyện.” Đây là mầm đầu tiên cho lớp Magic nhưng không giải thích thêm.

### 5.7. Tương tác với Ong V1

Ong luôn xuất hiện ở một vị trí có thể thấy nhưng không che cây. Khi bấm vào Ong, mở bong bóng thoại nhỏ, không chiếm toàn màn hình. Các câu thoại V1 mang tính chăm sóc và tạo không khí:

> “Hôm nay đất ẩm vừa đủ.”
>
> “Cây này thích được nhìn ngắm đấy.”
>
> “Bạn không cần làm hết mọi thứ trong một ngày.”
>
> “Tôi sẽ bay một vòng quanh vườn. Biết đâu mang về được thứ gì hay.”

Nếu người dùng bấm Ong nhiều lần trong một phiên, thoại chuyển sang trạng thái cooldown: “Tôi vẫn ở đây. Nhưng đôi cánh cũng cần nghỉ một chút.”

## 6. V2 — Bổ sung lớp Mini Game Garden

### 6.1. Mục tiêu V2

V2 không thay đổi màn hình Vườn thành bảng điều khiển game. Thay vào đó, hệ thống thêm một dải thông tin nhẹ ở phía trên hoặc một thẻ “Việc nhỏ hôm nay”. Người dùng có thể bỏ qua thẻ này và vẫn sử dụng đầy đủ chức năng chăm vườn.

### 6.2. Thẻ Nhiệm vụ hôm nay

Thẻ nhiệm vụ đặt bên dưới phần tóm tắt khu vườn. Mỗi ngày có tối đa ba nhiệm vụ, lấy từ các hành động đang có trong V2. Không tạo nhiệm vụ yêu cầu đăng nhập đúng giờ, không dùng deadline gây áp lực.

```text
┌──────────────────────────────────────┐
│ ✨ Việc nhỏ hôm nay             1/3  │
│ □ Trồng 1 cây                         │
│ ✓ Tưới cây 2 lần                      │
│ □ Gặp một sinh vật                     │
│                                      │
│ Hoàn thành: +10 Garden EXP · +3 mật  │
└──────────────────────────────────────┘
```

Nhiệm vụ hoàn thành được đánh dấu bằng chuyển động rất ngắn và màu xanh lá. Phần thưởng chưa nhận có nhãn **Nhận phần thưởng**; sau khi nhận, thẻ chuyển sang trạng thái nhẹ: “Bạn đã làm đủ cho hôm nay.”

### 6.3. Màn hình Kho đồ V2

Kho đồ V2 thêm thanh thông tin nhỏ ở đầu: số mật ong, số hạt giống và số vật phẩm chưa xem. Mật ong không nên hiển thị như tiền vàng; dùng icon giọt mật hoặc lọ mật, kèm nhãn “Mật ong khu vườn”.

Các nhóm V2 gồm **Hạt giống**, **Trang trí**, **Mật ong**, **Vật phẩm lạ**. Nhóm Vật phẩm lạ có thể bị khóa hoặc chưa xuất hiện cho đến khi người dùng thật sự nhặt được vật phẩm đầu tiên.

```text
Kho đồ                         🍯 18
[Hạt giống] [Trang trí] [Vật phẩm lạ]

🌻 Hướng Dương ×2       [Trồng]
🌷 Tulip ×1             [Trồng]
🪵 Ghế gỗ ×1            [Đặt vào vườn]
```

### 6.4. Màn hình Phần thưởng

Sau khi hoàn thành nhiệm vụ, mở một dialog nhỏ thay vì màn hình pháo hoa toàn trang. Dialog hiển thị hành động vừa hoàn thành, Garden EXP, mật ong và item mới nếu có.

```text
Bạn đã làm một việc tốt cho khu vườn.

+10 Garden EXP       +3 🍯
Nhận được: 🌷 Hạt giống Tulip

[Đặt vào kho]       [Xem hạt giống]
```

Nếu người dùng đã nhận phần thưởng, mở lại dialog chỉ hiển thị lịch sử; không cộng lại tài nguyên. Đây là điều kiện cần để tránh lỗi duplicate khi reload.

### 6.5. Màn hình Thành tựu V2

Thành tựu được trình bày như các nhãn trong một cuốn sổ, không phải bảng xếp hạng. Mỗi thành tựu có tên, mô tả, tiến độ và một câu ghi chú. Một số thành tựu có thể để dành cho lớp Magic nhưng V2 chỉ hiển thị mô tả trung tính.

| Thành tựu | Điều kiện | Phần thưởng | Ghi chú giao diện |
|---|---|---|---|
| **Người Làm Vườn** | Trồng 10 cây | +20 EXP, 5 mật ong | Hiển thị tiến độ `6/10` |
| **Bạn Của Sinh Vật** | Gặp 3 sinh vật | Hạt giống Cỏ | Không yêu cầu bắt hay thu thập |
| **Sau Cơn Mưa** | Tìm vật phẩm sau mưa | Đèn nhỏ | Chỉ xuất hiện khi V2 có thời tiết |
| **Một Ngày Nữa** | Ghé vườn 5 ngày bất kỳ | Khung tên vườn | Không dùng streak liên tục |

### 6.6. Garden EXP và tiến trình

Garden EXP chỉ là chỉ báo tiến triển mềm. Không hiển thị cấp độ lớn ở đầu trang và không dùng các con số kiểu sức mạnh. Có thể hiển thị một thanh nhỏ trong thẻ hồ sơ hoặc Nhật ký:

```text
Garden EXP
██████░░░░  60 / 100
Khu vườn đang mở lòng thêm một chút.
```

Khi đạt mốc, phần thưởng nên là nội dung chăm vườn: hạt giống, chậu, đèn, khu đất hoặc trang trí. Không thưởng các chỉ số làm thay đổi cân bằng theo hướng cạnh tranh.

### 6.7. Màn hình Nhật ký V2

V2 mở rộng Nhật ký thành trung tâm phản chiếu tiến trình. Phần đầu hiển thị tổng quan ngắn, phần dưới chia thành các nhóm sưu tầm. Tab **Nhiệm vụ** lưu các nhiệm vụ đã hoàn thành; tab **Thành tựu** lưu các mốc; tab **Điều kỳ lạ** ghi những sự kiện có dấu hiệu bất thường.

Mục **Điều kỳ lạ** dùng ngôn ngữ không chắc chắn. Ví dụ: “Một cánh cửa chưa được đặt tên đã xuất hiện trên bản đồ.” Không ghi rõ điều kiện mở cửa và không đánh dấu bằng nhãn “quest chính”.

### 6.8. Mở khóa khu vực V2

Trong V2, chỉ nên mở thêm một khu vực rõ ràng là **Vườn Hoa**. Điều kiện có thể là trồng đủ năm cây hoặc hoàn thành một số nhiệm vụ, nhưng cần diễn đạt như một lời mời:

> “Khu đất phía đông đã đủ màu để bắt đầu chăm sóc.”

Các khu như Khu Rừng, Ao Nước, Vườn Đêm và Cánh Cửa Không Tên chỉ nên xuất hiện dưới dạng dấu hiệu bản đồ hoặc silhouette, tránh mở rộng hệ thống quá sớm.

## 7. Luồng người dùng quan trọng

### Luồng A — Người dùng chỉ muốn thư giãn

Người dùng mở app, nhìn thấy thời tiết và cây đang lớn, bấm vào một cây để tưới, sắp xếp một vật trang trí rồi đóng app. Không cần mở Kho đồ, không cần nhận quest và không bị modal chặn.

### Luồng B — Người dùng muốn có mục tiêu

Người dùng thấy thẻ “Việc nhỏ hôm nay”, hoàn thành ba nhiệm vụ, nhận EXP và mật ong, mở Kho đồ để chọn phần thưởng, sau đó xem Thành tựu. Luồng này phải hoàn tất trong vài phút và không yêu cầu khám phá lớp Magic.

### Luồng C — Người dùng tò mò

Người dùng thấy một câu thoại lạ của Ong, mở Nhật ký, xem mục Điều kỳ lạ, quay lại Bản đồ và nhận ra một vị trí chưa có tên. Hệ thống không ép họ đi tiếp; họ có thể quay lại chăm cây bất kỳ lúc nào.

## 8. Responsive, accessibility và trạng thái lỗi

Trên mobile, mọi thao tác chính cần dùng được bằng một tay. Action sheet mở từ cạnh dưới, nút đóng nằm trong vùng dễ chạm và không yêu cầu kéo chính xác. Canvas vườn phải co giãn nhưng không làm mất vùng bấm của cây.

Các animation quan trọng phải tôn trọng `prefers-reduced-motion`. Khi người dùng bật giảm chuyển động, thay animation bằng thay đổi màu, viền hoặc icon. Âm thanh nền tắt mặc định hoặc có nút bật rõ ràng. Nút và icon có nhãn aria; icon không được là tín hiệu duy nhất.

Nếu `localStorage` không khả dụng, hiển thị banner không chặn: “Trình duyệt hiện không lưu được khu vườn. Bạn vẫn có thể chơi trong phiên này; hãy dùng Xuất dữ liệu khi có thể.” Khi dữ liệu hỏng, không tự ghi đè. Cung cấp lựa chọn khôi phục từ bản sao JSON hoặc bắt đầu khu vườn mới.

## 9. Tiêu chí nghiệm thu V1–V2

| ID | Tiêu chí |
|---|---|
| UX-01 | Người dùng mới có thể trồng cây đầu tiên mà không cần đọc hướng dẫn dài |
| UX-02 | Từ màn hình Vườn, người dùng nhận biết được cây nào cần tưới trong một lần quan sát |
| UX-03 | Mọi hành động trồng, tưới, đặt đồ và nhận thưởng đều có phản hồi trực quan |
| UX-04 | Người dùng có thể bỏ qua nhiệm vụ mà không mất quyền truy cập chức năng chính |
| UX-05 | Dữ liệu cây, vật phẩm, nhiệm vụ và thành tựu không bị nhân đôi sau khi reload |
| UX-06 | Màn hình mobile không bị cuộn ngang và nút chính đạt vùng chạm đủ lớn |
| UX-07 | Nhật ký chỉ ghi nhận những gì người dùng thật sự đã nhìn thấy hoặc hoàn thành |
| UX-08 | Các khu vực Magic chưa mở không tiết lộ spoiler qua tên hoặc phần thưởng |
| UX-09 | Người dùng có thể tắt âm thanh và giảm chuyển động |
| UX-10 | Khi localStorage lỗi, ứng dụng không âm thầm xóa dữ liệu cũ |

## 10. Định hướng dữ liệu tối thiểu

Để triển khai V1–V2 bằng HTML/CSS/JS, có thể lưu một object duy nhất trong `localStorage` với các nhóm dữ liệu sau. Cấu trúc này đủ cho gameplay ban đầu và có thể mở rộng khi thêm lớp Magic.

```js
{
  version: 2,
  garden: {
    name: "Khu vườn nhỏ",
    day: 1,
    weather: "sunny",
    unlockedAreas: ["starter-garden"],
    decorations: [],
    plots: []
  },
  inventory: {
    seeds: { sunflower: 1, tulip: 1 },
    decorations: {},
    oddItems: {}
  },
  economy: {
    honey: 0,
    gardenExp: 0
  },
  quests: {
    dateKey: "",
    items: [],
    claimed: []
  },
  collections: {
    plantsSeen: [],
    creaturesSeen: [],
    odditiesSeen: [],
    achievements: []
  },
  settings: {
    sound: false,
    reducedMotion: false
  }
}
```

Mọi thay đổi dữ liệu nên đi qua một hàm lưu tập trung, có kiểm tra `version` để migrate từ V1 sang V2. Không lưu trạng thái tạm của modal hoặc animation vào localStorage.

## 11. Kết luận thiết kế

V1 cần khiến người dùng yêu khu vườn trước khi yêu hệ thống. V2 chỉ thêm vừa đủ mục tiêu để khu vườn có nhịp quay lại, nhưng không làm mất sự yên tĩnh. Khi hai phiên bản này ổn định, lớp Magic có thể xuất hiện qua Nhật ký, Bản đồ và lời thoại của Ong mà không cần thay đổi cấu trúc điều hướng cốt lõi.
