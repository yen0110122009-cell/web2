# Tham chiếu GitHub Pages

Kho hiện được GitHub Pages phục vụ từ nhánh `main` tại thư mục gốc. Vì vậy, ứng dụng React/Vite được biên dịch trước thành HTML, JavaScript, CSS và tài nguyên tĩnh; bundle kết quả được đặt tại gốc kho để Pages phục vụ trực tiếp. Lệnh `pnpm build:pages` tạo bundle từ entry `client/index.html`, giữ entry nguồn tách biệt với `index.html` tĩnh đang công khai.

> GitHub Pages có thể dùng một nhánh và thư mục xuất bản làm nguồn nội dung; ứng dụng cần build trước phải cung cấp bản tĩnh đã biên dịch tại nguồn đó.[1]

## Tham chiếu

[1]: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site "Configuring a publishing source for your GitHub Pages site"
