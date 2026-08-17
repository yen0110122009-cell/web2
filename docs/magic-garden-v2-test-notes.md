# Magic Garden V2 — Ghi chú kiểm thử

## Kiểm tra trực quan ban đầu

Prototype tải thành công tại `index.html?v2=1`. Màn hình chính hiển thị đúng header, trạng thái ngày/mật ong, thẻ Ong, ba nút thao tác chính, cánh cửa, bốn ô đất, Bướm, Ong, danh sách cây, túi đồ 12 ô, nhật ký và thanh điều hướng đáy.

Các hook tương tác chính đã xuất hiện trong DOM: `plant-btn`, `weather-btn`, `time-btn`, `bee-btn`, `stage-bee`, `stage-butterfly`, `door-btn`, `stage-door`, `bag-btn`, `clue-btn`, các nút ô đất và thanh điều hướng.

Ảnh chụp kiểm tra cho thấy bố cục desktop ổn định, tiêu đề và văn bản tiếng Việt không bị tràn card. Cần tiếp tục kiểm tra bằng DOM event đối với modal trồng cây, modal túi đồ, tương tác Ong/Bướm và chuyển trạng thái thời tiết/ngày đêm.

Lệnh kiểm tra tĩnh đã vượt qua: `node --check`, cân bằng thẻ `button`/`script` và `git diff --check`.

## Kiểm tra modal bằng DOM

Lần click trực tiếp trong browser automation không mở modal. Lần chạy DOM event dùng biểu thức IIFE cũng trả về `{ modal: false, seeds: [] }`. Vì ảnh chụp vẫn cho thấy hai ô đất trống, cần kiểm tra console/runtime và trạng thái localStorage để xác định event handler có được bind hay không; không kết luận đây là lỗi giao diện trước khi xem lỗi runtime.

## Phát hiện runtime

DOM cho thấy `plant-list`, `slots` và `log` đều còn rỗng, đồng thời click trực tiếp vào `weather-btn` không đổi `data-weather`. Điều này cho thấy script V2 chưa chạy tới `bind(); render();` trong browser, dù HTML/CSS vẫn tải và các nút tĩnh vẫn hiện. Cần kiểm tra phiên bản file mà server đang phục vụ và lỗi parse/runtime trước khi commit.

## Server mới

Đã đối chiếu SHA-256 của file local với file được phục vụ ở cổng 4173 và 4174; hai bản trùng khớp. Server mới cũng tải đúng title V2. Console không có output hoặc lỗi hiển thị tự động. DOM động vẫn cần xác minh tiếp bằng cách đọc script element và trạng thái thực thi.

## Kiểm thử tương tác sau bản sửa

Sau khi chuyển thứ tự khai báo `copy` lên trước `state=load()`, script đã chạy đúng. DOM đã render hai cây, các nút tưới, 12 ô túi đồ, nhật ký và thanh điều hướng.

Modal `Trồng cây` mở đúng và hiển thị đủ bốn hạt giống: `sunflower`, `tulip`, `rose`, `mystery`. Luồng kiểm thử mưa + ban đêm + mở Hướng Dương + thử biến dị đã hoạt động: cây đổi thành `Sunflower Star`, số manh mối tăng lên `1/5`, `data-weather=rain` và `data-time=night` được cập nhật.
