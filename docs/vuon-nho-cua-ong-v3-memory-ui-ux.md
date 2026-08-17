# Vườn Nhỏ Của Ong

## Đặc tả UI/UX V3 — Màn hình giải mã ký ức và cánh cửa

**Phiên bản:** V3  
**Phạm vi:** Màn hình tổng quan ký ức, màn hình giải mã 5 khu vực, bảng ghép mảnh ký ức và các trạng thái cánh cửa.  
**Nguyên tắc:** Bí ẩn nhưng dễ hiểu, giàu không khí nhưng không làm người chơi mất phương hướng.

---

## 1. Mục tiêu trải nghiệm

Màn hình giải mã không nên có cảm giác như một bảng nhiệm vụ hoặc menu thành tích. Nó cần giống một cuốn sổ tay sống, được tạo từ giấy, lá khô, vết mật ong và những mảnh hình ảnh chưa hoàn chỉnh.

Người chơi mở màn hình này để trả lời ba câu hỏi:

1. **Mình đã tìm thấy những gì?**
2. **Mảnh nào có thể ghép với nhau?**
3. **Cánh cửa đang còn thiếu điều gì?**

Mỗi hành động trên giao diện phải giúp người chơi tiến gần hơn tới một sự thật, nhưng không giải thích toàn bộ cốt truyện ngay lập tức.

> **UI không nói “hãy hoàn thành nhiệm vụ”. UI nói “khu vườn đang nhớ lại thêm một chút”.**

## 2. Kiến trúc điều hướng

Luồng chính gồm bốn lớp. Người chơi có thể đi tới lui giữa các lớp mà không mất trạng thái.

| Lớp | Tên màn hình | Vai trò |
|---|---|---|
| 1 | **Bản Đồ Ký Ức** | Hiển thị 5 khu vực và tiến trình tổng thể |
| 2 | **Phòng Ký Ức** | Hiển thị mảnh đã thu thập, câu đố và điều kiện khu vực |
| 3 | **Bàn Ghép Ký Ức** | Kéo hoặc chọn mảnh để nối thành sự thật |
| 4 | **Cánh Cửa** | Hiển thị các dấu ấn, trạng thái khóa và lựa chọn cuối V3 |

Navigation trên desktop đặt ở bên trái. Trên mobile, nó chuyển thành thanh tab cố định ở cuối màn hình.

### Sơ đồ luồng

```text
Khu vườn chính
      │
      ▼
Bản Đồ Ký Ức ───────► Cánh Cửa
      │                  │
      ▼                  ▼
Phòng Ký Ức ───────► Bàn Ghép Ký Ức
      │
      ▼
Câu đố khu vực
      │
      ▼
Mảnh ký ức mới + Dấu ấn khu vực
```

## 3. Màn hình Bản Đồ Ký Ức

### 3.1. Bố cục

Màn hình mở bằng một lớp phủ nền màu xanh đêm pha kem giấy. Ở trung tâm là bản đồ vẽ tay của Vườn Nhỏ Của Ong. Năm khu vực được đặt thành một vòng cung quanh biểu tượng cánh cửa.

```text
┌─────────────────────────────────────────────┐
│ ← Vườn chính       KÝ ỨC CỦA KHU VƯỜN   ⚙  │
├─────────────────────────────────────────────┤
│                                             │
│             [Hồ Phản Chiếu]                │
│                    ◇                        │
│ [Hiên Mật Ong] ─ [CÁNH CỬA] ─ [Tổ Ong]     │
│                    ◇                        │
│       [Vườn Hạt]       [Phòng Không Tường] │
│                                             │
├─────────────────────────────────────────────┤
│ 3/5 dấu ấn     10/15 mảnh lõi     62% nhớ lại│
└─────────────────────────────────────────────┘
```

### 3.2. Thẻ khu vực

Mỗi khu vực là một thẻ tròn hoặc hình đa giác mềm, không dùng góc vuông cứng. Thẻ gồm biểu tượng, tên, trạng thái và một vòng tiến trình.

| Trạng thái | Hình ảnh | Nhãn hiển thị | Hành động |
|---|---|---|---|
| Chưa thấy | Mờ, phủ sương | “Chưa nhớ” | Không thể mở |
| Có dấu vết | Có một chấm sáng | “Có dấu vết” | Mở phòng ký ức |
| Đã nối lại | Vòng tiến trình 2/3 | “Đã nối lại” | Mở câu đố còn lại |
| Đã hiểu | Dấu ấn phát sáng | “Đã hiểu” | Xem lại ký ức hoàn chỉnh |
| Bị nhiễu | Nhấp nháy nhẹ | “Có điều gì đó sai” | Kiểm tra mảnh ghép sai |

Khu vực chưa mở không nên chỉ hiện biểu tượng khóa. Nó nên hiện một khoảng trắng có hình dáng chưa hoàn chỉnh, để gợi cảm giác rằng địa điểm đang được tạo ra từ ký ức.

### 3.3. Thông tin tổng quan

Phần dưới bản đồ có ba chỉ số lớn:

| Chỉ số | Nội dung |
|---|---|
| **Dấu ấn** | Số khu vực đã hiểu trên tổng 5 |
| **Mảnh lõi** | Số mảnh quan trọng đã thu thập |
| **Mức nhớ lại** | Phần trăm sự thật đã được kết nối |

Không dùng thanh phần trăm quá nổi bật. Đây là chỉ số hỗ trợ, không phải điểm số. Nhãn nên viết theo ngôn ngữ giàu cảm xúc, ví dụ: **“Khu vườn nhớ lại: 62%”**.

## 4. Màn hình Phòng Ký Ức dùng chung

Mỗi khu vực dùng cùng một khung giao diện để người chơi không phải học lại cách dùng. Nội dung, màu sắc và dạng câu đố thay đổi theo khu vực.

```text
┌─────────────────────────────────────────────┐
│ ← Bản đồ ký ức      HIÊN MẬT ONG       1/3 ✦│
├─────────────────────────────────────────────┤
│                                             │
│        [minh họa không gian khu vực]        │
│                                             │
│  “Nơi này từng có một chiếc ghế.”           │
│                                             │
│  MẢNH ĐÃ TÌM THẤY                            │
│  [◌] [∿] [◆] [ ? ]                           │
│                                             │
│  CÂU ĐỐI ĐANG CHỜ                            │
│  Bảy lọ mật ong                               │
│                         [Bắt đầu giải mã]    │
└─────────────────────────────────────────────┘
```

### 4.1. Header khu vực

Header gồm nút quay lại, tên khu vực, trạng thái tiến trình và nút nghe lại lời dẫn của Ong. Nếu đang ở trạng thái “Đã hiểu”, header có thêm dấu ấn sáng nhỏ.

Nhãn tiến trình nên dùng dạng `1/3 — Có dấu vết`, không dùng phần trăm trong màn hình câu đố. Người chơi cần biết mình đang ở bước nào, không cần cảm thấy đang bị chấm điểm.

### 4.2. Minh họa môi trường

Minh họa có thể là CSS illustration, canvas hoặc ảnh nền sau này. Các điểm tương tác được đánh dấu bằng ánh sáng chuyển động rất chậm. Khi người chơi đã chạm vào một điểm, ánh sáng chuyển từ vàng sang xanh nhạt.

Không nên đánh dấu mọi điểm tương tác cùng lúc. Chỉ hiển thị tối đa một gợi ý rõ ràng và một gợi ý mờ để giữ cảm giác khám phá.

## 5. Thiết kế riêng cho 5 khu vực

### 5.1. Hiên Mật Ong — Câu đố ghép lọ và lá

Màn hình dùng bố cục đối xứng: bảy lọ mật ong ở phía trên, bảy chiếc lá ở phía dưới. Người chơi chọn một chiếc lá rồi chọn lọ tương ứng. Trên mobile, thao tác chuyển thành chạm lá rồi chạm lọ.

| Thành phần | Thiết kế UI |
|---|---|
| Nền | Gỗ sáng, ánh nắng cuối chiều |
| Màu nhấn | Vàng mật ong và nâu ấm |
| Phản hồi đúng | Lọ phát sáng, âm thanh thủy tinh mềm |
| Phản hồi sai | Lá rung nhẹ, không trừ lượt |
| Mảnh nhận được | Hình chiếc ghế, âm thanh thìa, nhãn bị bóc |
| CTA | “Đặt chiếc lá cạnh lọ” |

Khi người chơi chọn đúng lọ Không Nhãn, một lớp mật ong bạc lan ra thành vòng tròn. Nút hành động đổi từ **“Kiểm tra cặp ghép”** thành **“Chạm vào ký ức”**.

### 5.2. Vườn Hạt Cuối Cùng — Câu đố điều kiện trồng cây

Màn hình gồm ba luống đất có nhãn **Nắng**, **Mưa** và **Đêm**. Trên cùng là thanh môi trường hiển thị ngày/đêm và mưa/nắng hiện tại. Người chơi phải chuyển môi trường bằng nút trong giao diện, sau đó gieo hạt đúng luống.

| Thành phần | Thiết kế UI |
|---|---|
| Nền | Đất tối, các đường gân phát sáng dưới đất |
| Màu nhấn | Xanh lá non, xanh mưa và tím đêm |
| Phản hồi đúng | Hạt chìm xuống, có vòng sáng dưới đất |
| Phản hồi sai | Hạt nằm yên, Ong đưa gợi ý |
| Mảnh nhận được | Ba biến thể cây và Hạt Không Tên |
| CTA | “Đổi điều kiện” và “Gieo hạt” |

Nút đổi điều kiện không nên làm giao diện chuyển cảnh đột ngột. Ánh sáng nên thay đổi trong khoảng 600–900 ms, để người chơi cảm thấy môi trường đang chuyển chứ không phải trạng thái bị thay thế.

### 5.3. Hồ Phản Chiếu — Câu đố quan sát thời điểm

Hồ chiếm phần lớn màn hình. Ba vòng gợn nước được đặt ở ba vị trí khác nhau. Mỗi vòng chỉ hiện một phiên bản ký ức tương ứng với một trạng thái môi trường.

| Thành phần | Thiết kế UI |
|---|---|
| Nền | Mặt hồ tối, viền bạc, ít thành phần phụ |
| Màu nhấn | Bạc xanh và tím xám |
| Phản hồi đúng | Mặt hồ đóng băng trong 1 giây rồi hiện cảnh |
| Phản hồi sai | Gợn nước lan ra ngoài, không khóa tiến trình |
| Mảnh nhận được | Người làm vườn, chìa khóa đá, lá thư |
| CTA | “Nhìn xuống hồ” |

Người chơi không cần biết ngay thứ tự `ngày → mưa → đêm`. Gợi ý được thể hiện bằng Bướm: nó bay về vòng gợn tiếp theo nếu người chơi đã xem đúng trạng thái trước đó.

### 5.4. Tổ Ong Rỗng — Câu đố sắp xếp âm thanh

Màn hình có một tổ ong lớn gồm bảy ô. Mỗi ô là một nút phát âm thanh. Người chơi kéo các ô theo thứ tự hoặc chọn hai ô để đổi chỗ.

| Thành phần | Thiết kế UI |
|---|---|
| Nền | Nâu hổ phách, các ô tổ có độ sâu nhẹ |
| Màu nhấn | Vàng đậm và đen mềm |
| Phản hồi đúng | Ô tổ sáng, tiếng vo ve hòa vào nhịp nền |
| Phản hồi sai | Âm thanh dừng lại, ô rung nhẹ |
| Mảnh nhận được | Sáu âm thanh và một khoảng lặng |
| CTA | “Nghe lại chuỗi” và “Nối âm thanh” |

Khoảng lặng phải được biểu diễn bằng một ô trống có viền mờ, không ghi rõ “im lặng”. Khi người chơi đặt nó ở vị trí cuối, UI chỉ hiển thị: **“Có một thứ đã bị bỏ qua.”**

### 5.5. Căn Phòng Không Có Tường — Câu đố ghép một ngày

Đây là màn hình tổng hợp, dùng các mảnh cảnh lớn. Năm mảnh ký ức được đặt rời rạc như những tấm kính trong không gian. Người chơi kéo chúng thành một dòng thời gian.

| Thành phần | Thiết kế UI |
|---|---|
| Nền | Không gian trắng xanh, không có đường viền rõ |
| Màu nhấn | Trắng ngà, vàng nhạt và xanh ký ức |
| Phản hồi đúng | Hai mảnh nối bằng đường sáng mềm |
| Phản hồi sai | Mảnh trôi ra, không phát âm thanh phạt |
| Mảnh cuối | Hạt Không Tên, Lọ Mật Ong, Tay nắm cửa |
| CTA | “Ghép ngày này lại” |

Mảnh **Người Làm Vườn Rời Đi** có thể lật hai mặt. Đây là điểm UI quan trọng: không hiển thị biểu tượng đúng/sai trên mặt sau. Người chơi phải tự quyết định mình muốn nhớ sự kiện theo cách nào.

## 6. Màn hình Mảnh Ký Ức

Màn hình này mở bằng một drawer từ bên phải trên desktop và một sheet từ dưới lên trên mobile. Nó không che toàn bộ phòng ký ức, để người chơi luôn còn thấy không gian nơi mảnh được tìm thấy.

### 6.1. Thẻ mảnh ký ức

```text
┌────────────────────────────┐
│ ◌  MẢNH HÌNH  ·  HIÊN MẬT ONG│
│                              │
│       [hình ảnh mờ]          │
│                              │
│ “Có một chiếc ghế dưới hiên.”│
│                              │
│ Chưa nối với sự thật nào     │
│                              │
│ [Đặt lên bàn ghép] [Đóng]    │
└────────────────────────────┘
```

Mỗi thẻ có loại mảnh, nguồn, câu ngắn, trạng thái ghép và nút nghe/xem lại nếu là mảnh âm thanh hoặc hình ảnh.

### 6.2. Trạng thái thẻ

| Trạng thái | Cách hiển thị |
|---|---|
| Chưa xem | Hình ảnh mờ, nhãn “Chạm để nhớ” |
| Đã xem | Hình ảnh rõ hơn, có dấu chấm xanh |
| Đã ghép một phần | Đường nối vàng tới mảnh liên quan |
| Đã ghép hoàn chỉnh | Viền sáng và nhãn “Đã nối lại” |
| Mảnh lõi | Biểu tượng ✧, được ưu tiên trong sổ tay |

## 7. Bàn Ghép Ký Ức

Bàn ghép là màn hình tương tác chính để người chơi biến các mảnh rời thành một sự thật. Không nên dùng lưới cứng như inventory. Các mảnh nằm trên một mặt bàn, có thể kéo tự do trong vùng giới hạn.

```text
┌─────────────────────────────────────────────┐
│ ← Phòng ký ức        BÀN GHÉP        3 mảnh │
├─────────────────────────────────────────────┤
│                                             │
│      [mảnh hình] ─── [mảnh lời nói]         │
│            \                                │
│             ─── [mảnh vật thể]              │
│                                             │
│  KẾT LUẬN ĐANG HIỆN RA                      │
│  “Ong từng thuộc về một khu vườn cũ.”       │
│                                             │
│ [Thử ghép khác]                 [Lưu ký ức] │
└─────────────────────────────────────────────┘
```

Khi hai mảnh có liên hệ, hệ thống cho phép nối chúng bằng một đường sáng. Khi đủ bộ, một câu kết luận xuất hiện từng chữ một. Nút **“Lưu ký ức”** chỉ sáng khi người chơi đã đọc kết luận; điều này khiến việc ghép có cảm giác như một hành động chăm sóc, không phải xác nhận form.

### 7.1. Phản hồi ghép

| Tình huống | Phản hồi thị giác | Phản hồi âm thanh | Thông điệp |
|---|---|---|---|
| Hai mảnh có liên hệ | Đường sáng mảnh | Hai nốt hòa âm | “Chúng nhớ cùng một điều.” |
| Bộ mảnh hoàn chỉnh | Nền sáng lan rộng | Hợp âm ấm | “Một phần ký ức đã trở về.” |
| Hai mảnh không liên quan | Mảnh tách nhẹ | Không dùng âm thanh lỗi gắt | “Chúng chưa muốn đứng cạnh nhau.” |
| Ghép lại bộ đã hoàn thành | Màu ổn định | Âm thanh xác nhận ngắn | “Bạn đã nhớ điều này rồi.” |

## 8. Màn hình Cánh Cửa

Màn hình cánh cửa là nơi tổng hợp các dấu ấn, không phải một danh sách nhiệm vụ. Nó cần thay đổi rõ ràng theo từng trạng thái.

### 8.1. Trạng thái 1 — Cửa chưa có tên

Đây là trạng thái trước khi người chơi tìm thấy đủ manh mối V2. Cánh cửa chỉ hiện như một hình mờ ở góc bản đồ.

- Nhãn: **“Một nơi chưa được gọi tên”**.
- Hành động: **“Để đó”**.
- Gợi ý: Ong nói “Có những cánh cửa chỉ xuất hiện khi bạn ngừng tìm chúng.”
- Không hiển thị thanh tiến trình puzzle.

### 8.2. Trạng thái 2 — Cửa có dấu hiệu

Người chơi đã thu thập đủ dấu vết ban đầu nhưng chưa mở được V3.

- Nhãn: **“Cánh cửa đang lắng nghe”**.
- Hiển thị: 1–4 dấu chấm ký ức, chưa có số thứ tự.
- Hành động: **“Xem dấu hiệu”**.
- Phản hồi: rung nhẹ khi có mưa hoặc khi cây đột biến.

### 8.3. Trạng thái 3 — Có thể giải mã

Đã đủ năm manh mối và điều kiện mở puzzle V3.

- Nhãn: **“Ba tầng ký hiệu đang chờ bạn”**.
- Hiển thị: ba vòng khóa gồm Rune, Mã số và Môi trường.
- Hành động chính: **“Giải mã cánh cửa”**.
- Hành động phụ: **“Xem các manh mối”**.

### 8.4. Trạng thái 4 — Tầng rune

Modal hoặc màn hình riêng hiển thị ba lựa chọn biểu tượng. Không hiển thị chuỗi đúng ngay từ đầu.

```text
┌─────────────────────────────────────────────┐
│ 🚪 GIẢI MÃ CÁNH CỬA                 1/3     │
├─────────────────────────────────────────────┤
│ Một số ký ức phải được gọi theo đúng nhịp.  │
│                                             │
│   [🌙 Trăng] [◌ Ba tiếng gõ] [🐝 Ong]       │
│                                             │
│ Chuỗi đã chọn:  _  _  _                     │
│                                             │
│ [Gợi ý của Ong]                 [Để sau]    │
└─────────────────────────────────────────────┘
```

Rune đúng không biến mất sau khi chọn. Nó được đưa lên chuỗi ở trên và có thể phát lại âm thanh tương ứng. Rune sai sẽ trả về vị trí cũ, đồng thời Ong đưa gợi ý rất ngắn.

### 8.5. Trạng thái 5 — Tầng mã số

Sau chuỗi rune đúng, giao diện chuyển sang keypad. Mã `132` không hiển thị trực tiếp; người chơi ghép từ ba quan sát đã thu thập.

- Header: **“Tầng 2 · Mã ba số”**.
- Chỉ báo: `__3` → `_32` → `132`.
- Nút xóa không dùng màu đỏ; dùng màu xám để tránh cảm giác thất bại.
- Nhập sai hiển thị: **“Con số này chưa thuộc về ký ức nào.”**

### 8.6. Trạng thái 6 — Tầng môi trường

Đây là tầng kết nối puzzle với gameplay. UI hiển thị rõ điều kiện nhưng vẫn giữ ngôn ngữ thế giới.

```text
🌙 MƯA BAN ĐÊM
Cánh cửa chỉ phản hồi khi nghe thấy mưa dưới ánh trăng.

[Đặt tay lên khóa]
```

Nếu chưa đúng điều kiện, nút chính bị vô hiệu hóa nhưng không bị làm mờ hoàn toàn. Dưới nút có trạng thái động:

- Ngày, nắng: **“Ánh sáng còn quá rõ.”**
- Đêm, nắng: **“Đêm đã đến, nhưng khu vườn vẫn im.”**
- Ngày, mưa: **“Mưa đã nghe thấy bạn, nhưng trăng chưa xuất hiện.”**
- Đêm, mưa: **“Khóa đang ấm lên.”**

### 8.7. Trạng thái 7 — Cửa đã mở

Khi mở thành công, modal đóng lại để không che mất cảnh khu vườn. Một toast lớn xuất hiện trong khoảng 4 giây, sau đó trạng thái cánh cửa trên bản đồ đổi thành **“Đã mở”**.

- Cánh cửa không biến mất.
- Phía sau cửa hiển thị một luồng gió, không phải căn phòng.
- Nhật ký thêm mảnh `room-truth`.
- Nút mới: **“Bước vào Vườn Nhỏ Của Ong”**.

Thông điệp chính:

> **“Phía bên kia không phải là một căn phòng.”**

Thông điệp phụ:

> **“Đó là phần khu vườn đã chờ được nhớ lại.”**

### 8.8. Trạng thái 8 — Cửa mở một nửa

Nếu người chơi bước vào nhưng chưa ghép đủ ký ức, màn hình cửa có một khe sáng. Nút hành động là **“Nghe tiếng gió”**, không phải “Tiếp tục nhiệm vụ”.

Chỉ báo tiến trình: `2/5 khu vực đã hiểu`. Các khu vực còn lại xuất hiện dưới dạng khoảng trống có tiếng động rất nhỏ.

### 8.9. Trạng thái 9 — Cửa đã tin tưởng

Đạt đủ năm dấu ấn và ghép sự thật hoàn chỉnh. Cửa không còn dùng biểu tượng khóa. Tay nắm cửa chuyển thành biểu tượng hạt giống.

Nhãn mới:

> **“Cánh cửa không còn cần được canh giữ.”**

Hành động chính: **“Chọn điều sẽ mọc lên”**.

Đây là trạng thái mở ba lựa chọn kết thúc: giữ cửa mở, trồng Hạt Cuối Cùng hoặc để Ong quyết định.

## 9. Hệ thống toast và lời dẫn

Toast không nên xuất hiện quá thường xuyên. Chỉ dùng cho các sự kiện có ý nghĩa: tìm được mảnh lõi, hoàn thành bộ ghép, thay đổi trạng thái cánh cửa hoặc mở khu vực mới.

| Sự kiện | Toast đề xuất |
|---|---|
| Tìm mảnh mới | “Một ký ức đã tìm được đường về.” |
| Ghép đúng cặp | “Hai điều này đã từng ở cạnh nhau.” |
| Hoàn tất khu vực | “Khu vực này bắt đầu nhớ lại.” |
| Mở cửa | “Cánh cửa nghe thấy khu vườn.” |
| Ghép sai | Không dùng toast lớn; chỉ dùng lời dẫn tại chỗ |
| Chưa đủ điều kiện | “Cánh cửa chưa hỏi đến điều đó.” |

## 10. Design system

### 10.1. Màu sắc

| Token | Màu gợi ý | Công dụng |
|---|---|---|
| `ink-900` | `#25312b` | Chữ chính |
| `ink-600` | `#66736b` | Chữ phụ |
| `paper-50` | `#fffdf8` | Nền panel |
| `moss-500` | `#729c78` | Tiến trình và trạng thái đã nối |
| `honey-400` | `#e5b95c` | Mảnh ký ức và tương tác |
| `memory-blue` | `#8eaec0` | Ký ức đã xem |
| `night-violet` | `#766c9a` | Đêm và cánh cửa |
| `quiet-red` | `#b8897f` | Cảnh báo nhẹ, không dùng cho lỗi phạt |

### 10.2. Typography

Tiêu đề dùng serif mềm để giữ cảm giác truyện kể. Nội dung, nhãn và nút dùng sans-serif có line-height rộng, tối thiểu `1.45` cho văn bản tiếng Việt. Không dùng chữ in hoa toàn bộ cho đoạn dài.

| Thành phần | Kích thước desktop | Kích thước mobile |
|---|---:|---:|
| Tên màn hình | 28–34 px | 22–26 px |
| Tên khu vực | 20–24 px | 18–20 px |
| Nội dung chính | 16–18 px | 15–16 px |
| Nhãn phụ | 13–14 px | 13 px |
| Nút chính | 15–16 px | 15 px |

### 10.3. Hình dạng và chuyển động

Panel dùng bo góc `18–24 px`, bóng nhẹ và viền rất mảnh. Chuyển động không vượt quá 700 ms cho phản hồi thông thường. Các trạng thái bí ẩn dùng chuyển động lặp chậm, từ 3 đến 8 giây, tránh nhấp nháy nhanh.

Mỗi sự kiện cần có ba lớp phản hồi: thay đổi hình ảnh, thay đổi âm thanh và thay đổi câu chữ. Người dùng tắt animation vẫn phải hiểu được trạng thái qua màu, nhãn và biểu tượng.

## 11. Accessibility

Mọi biểu tượng khu vực phải có nhãn văn bản. Màu không được là tín hiệu duy nhất; trạng thái phải đi kèm chữ như **“Chưa nhớ”**, **“Đang ghép”** hoặc **“Đã hiểu”**.

Các nút rune và keypad cần có vùng chạm tối thiểu 44 × 44 px. Modal phải quản lý focus, nút đóng phải luôn có thể truy cập bằng bàn phím và phím Escape. Khi người chơi ghép thành công, thông báo cần được đọc qua `aria-live`.

Âm thanh không được là điều kiện bắt buộc để giải câu đố. Tổ Ong Rỗng phải có chế độ hiển thị dạng sóng hoặc nhãn mô tả cho người không nghe được âm thanh.

## 12. Responsive

Trên desktop, Bản Đồ Ký Ức dùng bố cục hai cột: bản đồ chiếm khoảng 62%, bảng tiến trình chiếm 38%. Phòng ký ức dùng minh họa ở trái và câu đố ở phải.

Trên mobile, mọi màn hình chuyển thành một cột. Bản đồ đặt phía trên, các khu vực xếp thành danh sách thẻ. Bảng ghép ký ức dùng canvas kéo trong vùng ngang có thể cuộn. Modal cánh cửa không vượt quá 92% chiều rộng màn hình và keypad dùng lưới ba cột.

Không để header, nút đóng hoặc CTA chính trôi ra ngoài viewport. Với màn hình thấp, phần nội dung câu đố cuộn độc lập nhưng nút hành động cuối vẫn giữ ở vùng dễ chạm.

## 13. Tiêu chí nghiệm thu

| Hạng mục | Tiêu chí đạt |
|---|---|
| Điều hướng | Người chơi đi từ bản đồ đến từng khu vực và quay lại mà không mất state |
| Khu vực | Cả 5 khu vực có trạng thái khóa, có dấu vết, đã nối lại và đã hiểu |
| Mảnh ký ức | Mảnh mới có thể xem, nghe, đặt lên bàn ghép và lưu kết luận |
| Câu đố | Có phản hồi rõ cho đúng, sai, chưa đủ điều kiện và hoàn thành |
| Cánh cửa | Hiển thị đúng toàn bộ trạng thái từ chưa có tên đến đã tin tưởng |
| Âm thanh | Có thể bật/tắt; tắt âm thanh không làm mất thông tin gameplay |
| Responsive | Không tràn chữ, không chồng nút, modal và keypad dùng được trên mobile |
| Accessibility | Nút có nhãn, focus rõ, dùng được bằng bàn phím và không phụ thuộc màu |
| Persistence | Tiến trình khu vực, mảnh và cửa được lưu sau khi tải lại |

## 14. Tinh thần cuối cùng

Màn hình giải mã thành công khi người chơi không thấy mình đang điền vào một biểu mẫu. Họ cảm thấy mình đang ngồi xuống cạnh khu vườn, đặt các mảnh nhỏ bên cạnh nhau và chờ chúng tự nhận ra người thân của mình.

> **Cánh cửa không mở vì người chơi có đủ điểm. Cánh cửa mở khi giao diện, câu đố và câu chuyện cùng nói một điều: ký ức có thể được chăm sóc.**
