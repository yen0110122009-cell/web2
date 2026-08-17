# Ý tưởng thiết kế — Vườn Nhỏ Của Ong

## Ba hướng thẩm mỹ

### 1. Nhật ký Mật Ong
**Very Brief Intro:** Một cuốn nhật ký thực vật thủ công, dùng sắc giấy kem, vàng mật và nét mực xanh rêu. Trải nghiệm ấm áp, tĩnh lặng, như đang lật từng trang ký ức của khu vườn.

**Probability:** 0.07

### 2. Đêm Trong Nhà Kính
**Very Brief Intro:** Một không gian nhà kính sâu, tối và phát sáng bằng những dấu hiệu thực vật bí ẩn. Cảm xúc thiên về khám phá, nhưng vẫn mềm mại thay vì cyberpunk.

**Probability:** 0.04

### 3. Mảnh Vườn Gấp Giấy
**Very Brief Intro:** Khu vườn được dựng như một mô hình giấy cắt lớp, với bóng đổ dịu, texture hạt giấy và những mảng màu gouache. Nó tạo cảm giác đồ chơi thủ công có bí mật bên trong.

**Probability:** 0.09

---

## Hướng được chọn: Nhật ký Mật Ong

### Design Movement
**Botanical field journal meets storybook editorial.** Website là một cuốn sổ làm vườn sống: phần thông tin vận hành như ghi chép thực địa, trong khi những manh mối bí ẩn được thể hiện như mực phai, dấu ép hoa và trang giấy được đánh dấu.

### Core Principles
1. **Ấm áp trước, bí ẩn sau:** Bề mặt luôn thân thiện và bình yên; phần Magic chỉ dần hiện ra qua vết mực, tia sáng và tương tác nhỏ.
2. **Thông tin như ghi chép:** Trạng thái cây, ký ức và vật phẩm được trình bày như thẻ sổ tay, nhãn herbarium hoặc ghi chú dán tay.
3. **Không đối xứng có chủ đích:** Khu vườn là sân khấu chính, nhật ký và thẻ mục tiêu là các mảng phụ lệch nhịp thay vì dashboard lưới đồng đều.
4. **Tương tác có hậu quả nhẹ:** Tưới cây, hỏi Ong, theo Bướm và chạm vào cánh cửa đều để lại một dấu vết có thể nhìn thấy.

### Color Philosophy
Nền giấy **ivory ấm** tạo cảm giác bình yên và đủ tương phản để đọc lâu. **Vàng mật ong** là màu bản sắc cho phần thưởng và chỉ dẫn của Ong; **xanh lá rêu** giữ hệ thống cây cối vững chắc; **xanh đêm mực tàu** chỉ xuất hiện tại ký ức và cánh cửa để báo hiệu bí ẩn. Màu tím không được dùng làm gradient trang trí.

### Layout Paradigm
Trang chính được tổ chức như một **bàn làm vườn**: thanh thương hiệu mảnh ở trên, khu vườn chiếm trọng tâm bên trái, cột “ghi chú hôm nay” bên phải, và một khay dụng cụ trượt lên từ đáy trên màn hình nhỏ. Màn hình ký ức chuyển thành **bản đồ sao dạng đường mòn**, không phải một lưới thẻ trung tâm.

### Signature Elements
1. **Dấu sáp mật ong:** vòng tròn vàng nhạt có ký hiệu tổ ong, dùng cho tiến trình và thành tựu.
2. **Nhãn cây ép:** thẻ thông tin viền mực xanh rêu, có đường chỉ may giả và một nhành lá nhỏ.
3. **Mực đêm:** các manh mối Magic xuất hiện như mực xanh đậm lan nhẹ trên giấy, kèm chấm sáng như bụi phấn hoa.

### Interaction Philosophy
Tương tác quan trọng không dùng ngôn ngữ “nâng cấp/cày cuốc”. Người dùng **chăm**, **lắng nghe**, **theo dõi** và **ghi nhận**. Nút bấm dùng động từ gần gũi: “Tưới một lượt”, “Hỏi Ong”, “Theo Bướm”, “Mở sổ”.

### Animation
Các thao tác UI phản hồi trong 120–220ms với easing rõ nét. Hạt phấn, cánh bướm và ánh sáng cửa chỉ chuyển động chậm, theo nhịp thở; không có hiệu ứng nhấp nháy liên tục. Thẻ ký ức khi mở chuyển từ opacity 0 và scale 0.96; tôn trọng `prefers-reduced-motion`.

### Typography System
**Fraunces** cho tiêu đề, tên cây và các câu thoại mang tính truyện; **DM Sans** cho dữ liệu, menu, hành động và đoạn văn. Tiêu đề dùng weight 600–700, nội dung 400–500, nhãn system ở chữ hoa nhỏ với tracking rộng. Không dùng Inter.

### Brand Essence
**Vườn Nhỏ Của Ong là khu vườn kể lại ký ức cho những người muốn chăm sóc, sưu tầm và khám phá chậm rãi.**

Tính cách thương hiệu: **dịu dàng, tò mò, thủ công**.

### Brand Voice
Headlines gợi mở, như một người bạn tin cậy đang chỉ vào chi tiết chưa được gọi tên. CTA ngắn, cụ thể và mang tính quan sát.

Ví dụ: “Ong để lại một dấu phấn gần cánh cửa.”

Ví dụ: “Hôm nay, khu vườn nhớ thêm một điều.”

### Wordmark & Logo
Logo là **một giọt mật nhỏ chứa đường bay hình xoắn của Ong**, kết thúc bằng một chiếc lá non; không có chữ trong biểu tượng. Wordmark kết hợp Fraunces nghiêng nhẹ và một dấu chấm mật ong thay cho dấu chấm chữ “i” trong phần chữ phụ khi cần.

### Signature Brand Color
**Mật Hổ Phách — `#D9982C`**. Đây là màu duy nhất dùng cho các khoảnh khắc được xác nhận: mật ong, tiến trình, dấu sáp và hành động chính.

## Style Decisions

- Không dùng nền tím gradient, neon hoặc card bo tròn đồng loạt.
- Khu vườn luôn là khu vực trực quan lớn nhất; UI chỉ đóng vai trò ghi chép và hỗ trợ.
- Trạng thái Magic sử dụng xanh đêm mực tàu, ánh vàng hổ phách và chuyển động tinh tế, không dùng hiệu ứng hù dọa.
- Mọi text trên lớp nền biến động phải có lớp nền/overlay đủ tương phản.

### Điều chỉnh sau kiểm tra trực quan

- Mọi tài nguyên, tiến trình, túi đồ và nhiệm vụ được trình bày như **hiện vật nhật ký**: dấu sáp, phong bì hạt giống, nhãn mẫu vật, ghim giấy hoặc ghi chú viết tay; không dùng HUD hay lưới ô vuông kiểu game.
- Nhận diện đầu trang luôn dùng biểu tượng **giọt mật có đường bay xoắn của Ong kết thúc bằng lá non**, đi cùng wordmark Fraunces có chất truyện kể; không dùng logo vuông trống hoặc chữ mặc định.
- Mặt bí ẩn sử dụng **mực đêm xanh-đen thấm trên giấy**, ánh phấn hổ phách và đường viền thực vật; không dùng nền đen thuần, neon hay card tối kiểu cao cấp.
- Fraunces mang tiếng nói truyện kể cho tên cây, nhãn ký ức, lời Ong và các ghi chú; DM Sans chỉ phục vụ dữ liệu và thao tác thực dụng.
- Dấu sáp mật, đường bay nét đứt của Ong và giọt mật phải lặp lại có chủ đích ở tiến trình, phần thưởng và ghi chú cần chú ý để tạo một nhịp nhận diện riêng.
- Sân vườn vận hành như **trang mẫu vật sống**: có đường kẻ thực địa, chú thích lề, nhãn ép hoa và dấu băng giấy; thao tác chỉ được đặt lên trên lớp ghi chép này, không tách thành bảng điều khiển độc lập.
- Điều khiển thực dụng phải mượn hình thái **tab sổ tay, tem sáp, nhãn hạt giống, kẹp giấy hoặc băng giấy**; không dùng pill trung tính kiểu ứng dụng SaaS.
- Hình khu vườn luôn có lớp **mũi tên mực, đường bay Ong, chú thích thực địa, vết ép lá hoặc khung giấy mòn** để giữ cảm giác trang mẫu vật sống.
- Mặt bí ẩn được nối vào hệ giấy ivory bằng **mực đêm thấm viền, bụi phấn hổ phách và gờ thực vật**, không đứng tách rời như mô-đun dark mode.

### Ghi chú sau lượt rà soát bàn sắp đặt

- Các hành động thực dụng trên bàn sắp đặt phải dùng động từ của sổ tay và khu vườn, ưu tiên **ghim**, **cất**, **trở về**, **gọi tên** và **theo dấu** thay cho ngôn ngữ quản trị phần mềm.
- Điều hướng, chỉ số và công cụ nhanh phải xuất hiện như **tab sổ, nhãn hạt, dấu sáp hoặc mẩu giấy được ghim**, nhưng vẫn giữ thứ bậc đọc rõ ràng và thao tác bàn phím đầy đủ.
- Lớp mực đêm của cánh cửa phải có hạt phấn hổ phách, viền giấy và nét thực vật để bí ẩn như được phát hiện bên trong cuốn sổ, thay vì là một mô-đun tối tách biệt.

### Điều chỉnh sau trang ghi chép

- Bộ lọc, sắp xếp và hành động tệp xuất hiện như **nhãn hạt, ghi chú ghim hoặc ngăn kéo giấy**, không phải biểu mẫu trung tính.
- Một trang ghi chép chính cần khoảng thở và chú thích ở lề; các mục phụ được ghim lệch hoặc dán băng giấy để tránh nhịp lưới đồng đều.
- Dấu mật, đường bay Ong, nhãn lá ép và phấn hổ phách phải cùng đánh dấu tiến trình, phần thưởng, ký ức và ghi chép quan trọng.
- Mực đêm luôn có mép giấy ngà, phấn hổ phách và viền thực vật để được đọc như mực thấm từ trong cuốn sổ.
