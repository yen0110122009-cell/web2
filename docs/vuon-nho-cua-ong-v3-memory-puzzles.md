# Vườn Nhỏ Của Ong

## V3 — Hệ thống câu đố và mảnh ghép ký ức

> **Mục tiêu của V3:** Người chơi không chỉ mở cánh cửa, mà phải hiểu vì sao cánh cửa tồn tại, vì sao Ong khóa nó lại và điều gì đã bị bỏ quên trong Vườn Nhỏ Của Ong.

## 1. Nguyên tắc thiết kế

Hệ thống ký ức gồm năm khu vực bí mật. Mỗi khu vực chứa một câu đố chính và từ hai đến ba mảnh ký ức. Câu đố không kiểm tra tốc độ hay khả năng ghi nhớ của người chơi; chúng yêu cầu người chơi quan sát thời tiết, thời gian, hành vi của sinh vật, trạng thái cây và những thay đổi nhỏ trong môi trường.

Mỗi khu vực phải trả lời một câu hỏi khác nhau:

| Khu vực | Câu hỏi ký ức |
|---|---|
| **Hiên Mật Ong** | Ong đã từng sống ở đâu và ai đã chăm sóc nó? |
| **Vườn Hạt Cuối Cùng** | Vì sao các cây đột biến tồn tại? |
| **Hồ Phản Chiếu** | Điều gì đã khiến người làm vườn rời đi? |
| **Tổ Ong Rỗng** | Vì sao Ong khóa cánh cửa? |
| **Căn Phòng Không Có Tường** | Người chơi sẽ làm gì với sự thật đó? |

Người chơi có thể khám phá bốn khu vực đầu theo nhiều thứ tự. Tuy nhiên, khu vực thứ năm chỉ hoàn chỉnh khi đã thu thập đủ mười mảnh ký ức lõi và ít nhất ba mảnh phụ.

## 2. Mô hình mảnh ký ức

Mỗi mảnh ký ức có bốn thuộc tính: `id`, `source`, `truth`, `emotion` và `state`. `source` cho biết mảnh được tìm thấy ở đâu; `truth` là thông tin mà mảnh tiết lộ; `emotion` quyết định sắc thái hình ảnh và âm thanh; `state` xác định người chơi đã nhìn thấy, đã nghe hay đã ghép mảnh đó chưa.

Mảnh ký ức không hiển thị như một đoạn văn dài ngay từ đầu. Khi mới thu thập, nó chỉ xuất hiện dưới dạng hình ảnh, âm thanh hoặc một câu ngắn. Người chơi phải ghép các mảnh cùng chủ đề để mở phần diễn giải đầy đủ.

| Loại mảnh | Ký hiệu | Chức năng |
|---|---:|---|
| **Mảnh hình ảnh** | ◌ | Hiện một cảnh ngắn không có lời giải thích |
| **Mảnh âm thanh** | ∿ | Phát tiếng động hoặc câu thoại bị thiếu đầu/cuối |
| **Mảnh vật thể** | ◆ | Gắn với một đồ vật trong khu vườn |
| **Mảnh lời nói** | “ ” | Lưu một câu của Ong hoặc người làm vườn |
| **Mảnh cảm xúc** | ✦ | Cho biết ký ức mang cảm xúc nào: vui, sợ, tiếc nuối hoặc hy vọng |
| **Mảnh lõi** | ✧ | Bắt buộc để mở sự thật và tiến trình cánh cửa |

Mảnh lõi được đánh dấu trong sổ tay, nhưng người chơi không nhìn thấy toàn bộ ý nghĩa của nó cho đến khi ghép đúng cặp hoặc bộ ba liên quan.

## 3. Thanh tiến trình ký ức

Trong sổ tay, người chơi nhìn thấy năm biểu tượng tương ứng với năm khu vực. Mỗi khu vực có ba mức tiến trình:

| Mức | Tên trạng thái | Điều kiện |
|---:|---|---|
| 0 | Chưa nhớ | Chưa vào khu vực |
| 1 | Có dấu vết | Đã tìm thấy ít nhất một mảnh |
| 2 | Đã nối lại | Đã giải câu đố chính |
| 3 | Đã hiểu | Đã ghép đủ mảnh lõi và nghe lời giải thích |

Khi đạt mức 2, khu vực kế tiếp có thể xuất hiện. Khi đạt mức 3, người chơi nhận một **Dấu Ấn Ký Ức**. Năm dấu ấn không phải là chìa khóa vật lý; chúng là bằng chứng cho thấy người chơi đã hiểu đủ để được cánh cửa tin tưởng.

## 4. Khu vực 1 — Hiên Mật Ong

### 4.1. Vai trò

Hiên Mật Ong là nơi giới thiệu ngôn ngữ câu đố của V3. Câu đố có vẻ đơn giản nhưng dạy người chơi rằng đồ vật trong vườn có thể lưu ký ức.

Trên hiên có bảy lọ mật ong. Sáu lọ có nhãn của các loài cây: Tulip, Hướng Dương, Hoa Hồng, Cỏ Ba Lá, Hoa Mặt Trăng và Hoa Không Tên. Lọ thứ bảy không có nhãn. Bên cạnh các lọ là bảy chiếc lá khô, mỗi lá có một đường gân khác nhau.

### 4.2. Câu đố: Bảy lọ mật ong

Người chơi cần đặt đúng lá khô trước đúng lọ dựa trên màu của cây từng được trồng trong khu vườn hiện tại. Các cặp đúng được gợi ý bằng âm thanh vo ve rất nhỏ. Cặp sai không làm mất tiến trình; lọ chỉ mờ đi và Ong nói một câu gợi ý.

**Lời giải:** Lọ Không Nhãn phải đặt cạnh chiếc lá không có đường gân ở giữa. Đây là chiếc lá duy nhất không thuộc về một loài cây cụ thể.

Khi đặt đúng, mật ong trong lọ đổi từ màu vàng sang màu bạc. Người chơi chạm vào lọ để nghe ký ức đầu tiên.

### 4.3. Mảnh ký ức

| ID | Loại | Nội dung khi thu thập | Sự thật hoàn chỉnh |
|---|---|---|---|
| `porch-image` | Hình ảnh lõi | Một chiếc ghế gỗ dưới hiên | Ong từng ngủ dưới ghế khi còn rất nhỏ |
| `porch-sound` | Âm thanh | Tiếng thìa chạm vào lọ thủy tinh | Người làm vườn từng gọi Ong bằng một cái tên khác |
| `porch-label` | Vật thể lõi | Nhãn giấy bị bóc khỏi lọ | Vườn cũ có một hạt giống không được ghi trong sách |
| `porch-voice` | Lời nói | “Đừng để nó nở khi trời không mưa.” | Người làm vườn biết hạt Không Tên có khả năng giữ ký ức |

### 4.4. Lời thoại của Ong

Khi vào khu vực:

> “Tôi đã không còn dùng hiên này từ rất lâu.”

Khi người chơi chạm vào chiếc ghế:

> “À… tôi từng ngủ ở đây. Không phải vì mệt. Vì lúc đó tôi chưa có nơi nào khác.”

Khi ghép `porch-image` với `porch-label`:

> “Người làm vườn gọi tôi là Người Giữ Mật. Tôi không nghĩ cái tên đó còn phù hợp.”

Khi hoàn thành khu vực:

> “Bạn đã tìm được mảnh đầu tiên. Đừng vội ghép nó thành một câu chuyện.”

## 5. Khu vực 2 — Vườn Hạt Cuối Cùng

### 5.1. Vai trò

Vườn Hạt Cuối Cùng giải thích nguồn gốc của cây đột biến. Đây là câu đố dựa trên điều kiện môi trường, kết nối trực tiếp với gameplay V2.

Khu vực có ba luống đất: luống Nắng, luống Mưa và luống Đêm. Ở giữa là một hạt giống không có tên. Trên mỗi luống có một biểu tượng bị khuyết một phần.

### 5.2. Câu đố: Trồng đúng điều kiện

Người chơi cần trồng ba hạt theo ba điều kiện khác nhau:

| Luống | Hạt cần trồng | Điều kiện |
|---|---|---|
| Luống Nắng | Hướng Dương | Ngày, không mưa |
| Luống Mưa | Hoa Hồng | Mưa ban ngày |
| Luống Đêm | Tulip | Đêm, không mưa |

Sau khi ba cây nở, biểu tượng giữa khu vực hoàn thiện thành hình một vòng tròn có một khoảng trống. Người chơi phải để khu vườn chuyển sang **mưa ban đêm**, sau đó gieo Hạt Không Tên vào khoảng trống.

Cây Không Tên không mọc ngay. Người chơi phải rời khu vực, thực hiện một hành động khác và quay lại. Đây là cách dạy rằng một số ký ức cần thời gian, không thể ép mở bằng nút bấm.

### 5.3. Mảnh ký ức

| ID | Loại | Nội dung khi thu thập | Sự thật hoàn chỉnh |
|---|---|---|---|
| `seed-sun` | Hình ảnh lõi | Một người đặt tay lên cây Hướng Dương | Cây phát triển mạnh khi được chăm sóc, không phải khi bị điều khiển |
| `seed-rain` | Âm thanh | Tiếng mưa rơi trên mái kính | Người làm vườn tạo mưa để cứu những cây cuối cùng |
| `seed-night` | Vật thể lõi | Một chiếc kéo làm vườn bị gãy | Có thứ gì đó đã cắt bỏ phần cây bị nhiễm ký ức |
| `seed-nameless` | Mảnh lõi đặc biệt | Cây Không Tên nở một bông hoa không có màu cố định | Cây đột biến là ký ức tự tìm cách sống tiếp |

### 5.4. Lời thoại của Ong

Khi người chơi trồng sai điều kiện:

> “Không phải hạt nào cũng muốn được đánh thức cùng một lúc.”

Khi Cây Không Tên bắt đầu mọc:

> “Tôi nhớ nó. Tôi ước mình không nhớ.”

Khi cây nở:

> “Cây này không biến đổi. Nó chỉ thôi giả vờ là một cái cây bình thường.”

Khi hoàn thành khu vực:

> “Đừng gọi nó là đột biến trước mặt nó. Nó đã phải thay đổi quá nhiều để còn ở đây.”

## 6. Khu vực 3 — Hồ Phản Chiếu

### 6.1. Vai trò

Hồ Phản Chiếu lưu các ký ức bị cắt bỏ. Câu đố không nằm ở việc tìm vật phẩm mà ở việc quan sát mặt hồ vào những thời điểm khác nhau.

Mặt hồ có ba vòng gợn nước. Mỗi vòng hiện một phiên bản khác nhau của khu vườn. Người chơi phải quan sát ba lần, nhưng chỉ một lần trong mỗi trạng thái: ngày, đêm và mưa.

### 6.2. Câu đố: Ba lần nhìn xuống hồ

Người chơi phải chạm vào hồ theo thứ tự **ngày → mưa → đêm**. Nếu chạm sai, mặt hồ không phạt người chơi mà phát lại một tiếng thở dài. Bướm sẽ bay gần vòng gợn đúng tiếp theo để gợi ý.

Ở lần thứ nhất, người chơi thấy người làm vườn và Ong bên chiếc bàn nhỏ. Ở lần thứ hai, họ thấy người làm vườn đặt một chiếc chìa khóa đá xuống đất. Ở lần thứ ba, họ thấy Ong đóng cánh cửa.

Sau lần nhìn thứ ba, ba hình ảnh chồng lên nhau. Người chơi phải kéo chiếc chìa khóa đá về phía bóng của cánh cửa, không phải về phía cánh cửa thật.

### 6.3. Mảnh ký ức

| ID | Loại | Nội dung khi thu thập | Sự thật hoàn chỉnh |
|---|---|---|---|
| `lake-first` | Hình ảnh lõi | Ong và người làm vườn ngồi bên hồ | Ong từng có một người đồng hành |
| `lake-key` | Vật thể lõi | Chìa khóa đá được đặt xuống đất | Chìa khóa không mở cửa; nó ghi nhớ người đã chạm vào nó |
| `lake-letter` | Lời nói | “Nếu tôi đi, đừng đóng cửa vì tôi.” | Người làm vườn từng muốn khu vườn tiếp tục thay đổi |
| `lake-shadow` | Mảnh cảm xúc | Bóng Ong đứng một mình dưới mưa | Ong đã hiểu sai lời dặn và chọn khóa cửa |

### 6.4. Lời thoại của Ong

Khi người chơi nhìn hồ ban ngày:

> “Ban ngày dễ nhìn thấy những gì mình muốn nhớ.”

Khi người chơi nhìn hồ dưới mưa:

> “Mưa không làm ký ức rõ hơn. Mưa chỉ làm những thứ bị chôn không thể nằm yên.”

Khi người chơi kéo chìa khóa vào bóng cửa:

> “Đúng rồi. Cánh cửa chưa bao giờ cần chìa khóa.”

Khi hoàn thành khu vực:

> “Người đó nói tôi đừng đóng cửa vì họ. Tôi đã nghe thành: hãy đóng cửa để không mất họ.”

## 7. Khu vực 4 — Tổ Ong Rỗng

### 7.1. Vai trò

Tổ Ong Rỗng giải thích vì sao Ong khóa cánh cửa và cho người chơi nghe những âm thanh mà Ong đã giữ lại trong nhiều năm.

Tổ có bảy ô. Sáu ô chứa âm thanh, một ô hoàn toàn im lặng. Người chơi phải đặt các âm thanh theo trật tự từ nhỏ đến lớn: hạt rơi, cánh Bướm, tiếng thìa, tiếng mưa, tiếng kéo, tiếng cửa.

### 7.2. Câu đố: Bản nhạc của tổ ong

Mỗi ô có thể phát một âm thanh khi chạm vào. Người chơi cần sắp xếp chúng theo một chuỗi gợi ý được viết bằng các dấu chấm trên thành tổ. Dấu chấm biểu thị độ vang, không phải số thứ tự.

Chuỗi đúng là:

> **Hạt rơi → Cánh Bướm → Thìa chạm lọ → Mưa → Kéo gãy → Cửa đóng → Khoảng lặng.**

Ô cuối không phát âm thanh. Người chơi phải để nó ở vị trí cuối, vì khoảng lặng là phần bị Ong loại khỏi mọi lần kể chuyện.

### 7.3. Mảnh ký ức

| ID | Loại | Nội dung khi thu thập | Sự thật hoàn chỉnh |
|---|---|---|---|
| `hive-seed` | Âm thanh lõi | Một hạt rơi vào đất | Người làm vườn bắt đầu khu vườn từ một hạt nhỏ |
| `hive-wing` | Âm thanh | Tiếng Bướm bay quanh lọ mật | Bướm có thể đi qua những nơi Ong không tới được |
| `hive-cut` | Âm thanh lõi | Tiếng kéo cắt thân cây | Người làm vườn đã cắt một phần khu vườn để ngăn ký ức lan ra |
| `hive-door` | Âm thanh lõi | Tiếng khóa cửa và tiếng Ong gọi tên ai đó | Ong là người trực tiếp niêm phong cánh cửa |
| `hive-silence` | Cảm xúc lõi | Khoảng lặng dài hơn bình thường | Điều Ong sợ nhất không phải khu vườn biến mất, mà là bị quên |

### 7.4. Lời thoại của Ong

Khi người chơi mở ô âm thanh đầu tiên:

> “Tôi đã giữ những tiếng này lâu đến mức tưởng chúng là tiếng của mình.”

Khi sắp xếp đúng sáu âm thanh:

> “Bạn đang nghe một ngày cuối cùng.”

Khi đặt khoảng lặng vào vị trí cuối:

> “Đó là phần tôi đã bỏ đi.”

Khi ghép đủ mảnh:

> “Tôi đã khóa cửa. Không phải vì người làm vườn yêu cầu. Vì tôi sợ họ sẽ không quay lại.”

## 8. Khu vực 5 — Căn Phòng Không Có Tường

### 8.1. Vai trò

Đây là khu vực tổng hợp. Không gian chỉ xuất hiện khi người chơi đã đạt mức 3 ở bốn khu vực đầu và có ít nhất mười mảnh lõi.

Căn phòng không có tường, sàn hoặc trần. Nó được tạo bởi những mảnh cảnh đã thu thập: hiên gỗ ở bên trái, hồ ở giữa, tổ ong ở phía trên và một luống đất ở phía trước. Không có đồ vật nào đứng yên hoàn toàn.

### 8.2. Câu đố: Ghép lại một ngày

Người chơi nhận được năm mảnh cảnh lớn, mỗi mảnh là một khoảnh khắc:

1. Hạt giống được đặt xuống đất.
2. Ong được gọi tên.
3. Cây đầu tiên nở hoa.
4. Người làm vườn chuẩn bị rời đi.
5. Cánh cửa được khóa.

Người chơi phải ghép chúng theo thứ tự thời gian. Tuy nhiên, mảnh thứ tư có hai mặt: một mặt cho thấy người làm vườn rời đi, mặt kia cho thấy họ quay lại nhìn khu vườn. Người chơi phải lật mảnh này để chọn cách hiểu sự kiện.

Khi ghép đúng, căn phòng hiện ra ba vật thể: Hạt Không Tên, Lọ Mật Ong Không Nhãn và tay nắm cửa.

### 8.3. Mảnh ký ức cuối

| ID | Loại | Nội dung | Ý nghĩa |
|---|---|---|---|
| `room-seed` | Mảnh lõi | Hạt đầu tiên được gieo | Mọi khu vườn đều bắt đầu từ một điều nhỏ |
| `room-name` | Mảnh lời nói | Người làm vườn gọi tên Ong | Một cái tên là lời mời được ở lại |
| `room-departure` | Mảnh hình ảnh | Bóng người làm vườn đi qua cổng | Rời đi không đồng nghĩa với bỏ rơi |
| `room-choice` | Mảnh cảm xúc | Ong đứng giữa cửa mở và cửa đóng | Ong phải được tự quyết định, không chỉ được giải thoát |
| `room-truth` | Mảnh lõi cuối | Cánh cửa phản chiếu cả hai khu vườn | Vườn Nhỏ Của Ong chưa từng tách hoàn toàn khỏi khu vườn hiện tại |

### 8.4. Lời thoại tổng kết

Khi người chơi ghép đúng ngày:

> “Tôi nhớ rồi.”

> “Người làm vườn không bảo tôi giữ nguyên khu vườn.”

> “Họ bảo tôi chăm nó cho đến khi có người khác đến.”

Khi người chơi nhìn thấy ba vật thể cuối:

> “Bạn có thể đóng cửa lại. Bạn có thể giữ nó mở. Hoặc bạn có thể trồng thứ chưa từng được trồng.”

> “Lần này, tôi sẽ không chọn thay bạn.”

## 9. Hệ thống ghép ký ức

Mỗi mảnh có thể được kéo vào bảng ghép trong sổ tay. Các mảnh đúng chủ đề sẽ phát sáng cùng màu. Khi ghép đúng, người chơi nhận một đoạn **Ký Ức Đã Nối**.

| Bộ ghép | Mảnh cần có | Kết luận mở ra |
|---|---|---|
| **Ong thời nhỏ** | `porch-image` + `porch-sound` + `porch-label` | Ong từng thuộc về một khu vườn cũ |
| **Nguồn gốc đột biến** | `seed-sun` + `seed-rain` + `seed-nameless` | Cây đột biến giữ lại ký ức |
| **Lời dặn bị hiểu sai** | `lake-letter` + `lake-shadow` + `hive-door` | Ong đã khóa cửa vì sợ bị bỏ lại |
| **Ngày cuối cùng** | `hive-seed` + `hive-cut` + `hive-silence` | Khu vườn từng được cắt bỏ để cứu phần còn lại |
| **Sự thật hoàn chỉnh** | Năm Dấu Ấn Ký Ức + `room-truth` | Cánh cửa là một lời mời thay đổi |

Ghép sai không làm mất mảnh. Các mảnh chỉ tách ra và trở về sổ tay. Người chơi luôn có thể thử lại; mục tiêu là khuyến khích quan sát, không tạo cảm giác bị phạt.

## 10. Tiến trình mở khóa

| Mốc | Điều kiện | Phản hồi |
|---:|---|---|
| 1 | Mở cánh cửa V3 | Hiên Mật Ong xuất hiện |
| 2 | Hoàn thành Hiên Mật Ong | Vườn Hạt Cuối Cùng mở |
| 3 | Thu thập một cây đột biến | Hồ Phản Chiếu phản ứng |
| 4 | Hoàn thành Hồ Phản Chiếu | Tổ Ong Rỗng mở |
| 5 | Nghe đủ bảy âm thanh | Căn Phòng Không Có Tường xuất hiện |
| 6 | Ghép đủ mười mảnh lõi | Ba lựa chọn cuối được kích hoạt |
| 7 | Hoàn tất lựa chọn | Xác định kết thúc V3 và trạng thái V4 |

## 11. Phần thưởng và tác động lên khu vườn hiện tại

Phần thưởng không chỉ là vật phẩm. Mỗi khu vực làm thay đổi một chi tiết trong khu vườn chính.

| Khu vực hoàn thành | Phần thưởng | Thay đổi trong vườn chính |
|---|---|---|
| Hiên Mật Ong | Lọ Mật Ong Không Nhãn | Ong có thêm lời thoại về quá khứ |
| Vườn Hạt Cuối Cùng | Hạt Không Tên | Có thể trồng Cây Không Tên lần nữa |
| Hồ Phản Chiếu | Chìa Khóa Đá | Mặt hồ đôi lúc phản chiếu khu vườn cũ |
| Tổ Ong Rỗng | Ô Tổ Trống | Có thể nghe lại các âm thanh ký ức |
| Căn Phòng Không Có Tường | Dấu Ấn Cánh Cửa | Mở nhánh kết thúc và nội dung V4 |

## 12. Nhánh kết thúc theo mảnh thu thập

Nếu người chơi chỉ mở cửa nhưng chưa ghép ký ức, V3 kết thúc ở trạng thái **Cửa Mở Một Nửa**. Ong biết người chơi đã đi vào nhưng chưa đủ tin tưởng để kể toàn bộ câu chuyện.

Nếu người chơi thu thập đủ mảnh nhưng ghép sai các bộ quan trọng, kết thúc là **Khu Vườn Im Lặng**. Cửa không đóng, nhưng các sinh vật ngừng xuất hiện trong một thời gian. Người chơi có thể quay lại và ghép lại ký ức.

Nếu người chơi ghép đủ năm bộ, kết thúc mở ra ba lựa chọn chính: **Giữ cửa mở**, **Trồng Hạt Cuối Cùng** hoặc **Để Ong quyết định**. Không có lựa chọn xấu tuyệt đối. Mỗi lựa chọn chỉ trả lời khác nhau cho câu hỏi: khu vườn nên được bảo vệ bằng cách giữ nguyên hay bằng cách cho phép nó thay đổi.

## 13. Kết luận cảm xúc

Năm khu vực không phải năm màn chơi độc lập. Chúng là năm cách khác nhau để người chơi hiểu Ong: qua nơi nó từng ngủ, hạt giống nó từng chăm, mặt hồ nó từng nhìn, âm thanh nó cố giữ và cuối cùng là lựa chọn mà nó không còn muốn tự mình quyết định.

Khi V3 kết thúc, người chơi nên cảm thấy mình không vừa “phá xong một puzzle”, mà vừa giúp một nhân vật nhớ lại quyền được thay đổi.

> **Vườn Nhỏ Của Ong không mở cửa vì người chơi giải đúng tất cả câu đố. Nó mở cửa vì lần đầu tiên Ong tin rằng một ký ức có thể được chia sẻ mà không bị mất đi.**
