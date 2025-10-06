# Sửa lỗi CORS cho Firebase Storage

## Vấn đề:
Firebase Storage chặn upload từ localhost do CORS policy.

## Giải pháp:

### Cách 1: Cấu hình CORS thủ công (Khuyến nghị)

1. **Cài Google Cloud SDK:**

```bash
# Mac (dùng Homebrew)
brew install --cask google-cloud-sdk

# Hoặc download: https://cloud.google.com/sdk/docs/install
```

2. **Khởi tạo gcloud:**

```bash
gcloud init
# Chọn project: blog-7acf4
```

3. **Tạo file cors.json** (đã có trong thư mục gốc):

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

4. **Apply CORS config:**

```bash
cd /Users/nguyendanh/Desktop/Code\ Hoppy/danhnc.github.io
gsutil cors set cors.json gs://blog-7acf4.appspot.com
```

### Cách 2: Deploy lên Firebase Hosting hoặc GitHub Pages

Upload sẽ hoạt động khi deploy lên domain thật:

```bash
# Deploy lên GitHub Pages
git add .
git commit -m "Add upload feature"
git push origin master
```

Sau đó test trên: `https://danhnc.github.io`

### Cách 3: Dùng ngrok để có domain tạm (Nhanh nhất cho test)

```bash
# Cài ngrok
brew install ngrok

# Chạy
ngrok http 8000
```

Ngrok sẽ cho bạn URL dạng: `https://abc123.ngrok.io`

Dùng URL này để test (CORS sẽ work vì dùng HTTPS).

---

## Test sau khi fix CORS:

1. Restart server: `python3 -m http.server 8000`
2. Mở: `http://localhost:8000/test-upload.html`
3. Upload file
4. Kiểm tra Console không còn lỗi CORS

---

## Tạm thời: Dùng Firebase Console để upload

Trong khi chờ fix CORS, bạn có thể:

1. Vào Firebase Console → Storage
2. Upload file thủ công
3. Copy URL
4. Paste vào form admin

Nhưng đây không phải giải pháp lâu dài!
