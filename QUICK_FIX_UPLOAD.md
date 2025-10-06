# Quick Fix: Upload không hoạt động (404 Error)

## Vấn đề:
Upload file bị lỗi 404 Not Found

## Nguyên nhân:
Firebase Storage chưa được khởi tạo hoặc CORS chưa được cấu hình

## Giải pháp nhanh:

### Bước 1: Khởi tạo Firebase Storage

1. Vào: https://console.firebase.google.com/project/blog-7acf4/storage
2. Click **"Get started"**
3. Chọn **"Start in production mode"** (hoặc test mode cũng được)
4. Location: **asia-southeast1 (Singapore)**
5. Click **"Done"**

### Bước 2: Kiểm tra Bucket Name

Sau khi tạo xong, vào tab "Files" và xem bucket name. Có thể là:
- `blog-7acf4.appspot.com` (cũ)
- `blog-7acf4.firebasestorage.app` (mới)

Nếu khác với `blog-7acf4.firebasestorage.app`, hãy sửa file `js/firebase-config.js`:

```javascript
storageBucket: "TÊN-BUCKET-CHÍNH-XÁC-Ở-ĐÂY"
```

### Bước 3: Cấu hình Storage Rules (TEST MODE)

1. Vào tab **"Rules"**
2. Paste code sau:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

**⚠️ CHÚ Ý: Đây là TEST MODE - cho phép tất cả mọi người upload. Sau khi test xong phải đổi về Production mode!**

### Bước 4: Cấu hình CORS (Chỉ cần nếu vẫn lỗi)

Nếu vẫn bị lỗi CORS, cần cài Google Cloud SDK:

```bash
# Mac
curl https://sdk.cloud.google.com | bash

# Hoặc dùng Homebrew
brew install --cask google-cloud-sdk

# Init
gcloud init
# Chọn project: blog-7acf4

# Set CORS
cd /Users/nguyendanh/Desktop/Code\ Hoppy/danhnc.github.io
gsutil cors set cors.json gs://blog-7acf4.appspot.com
```

### Bước 5: Test

1. Refresh trang: https://kyodanh.github.io/danhnc.github.io/admin/dashboard.html
2. Đăng nhập admin
3. Click "Thêm bài mới"
4. Upload file
5. Kiểm tra không còn lỗi 404

---

## Production Rules (Sau khi test xong):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read
    match /{allPaths=**} {
      allow read: if true;
    }
    // Only authenticated users can upload
    match /blog/{fileName} {
      allow write, delete: if request.auth != null;
    }
  }
}
```

---

## Nếu vẫn không được:

1. Clear browser cache (Cmd+Shift+R hoặc Ctrl+Shift+R)
2. Kiểm tra Console (F12) xem lỗi gì
3. Đảm bảo đã đăng nhập admin (cần auth để upload)
4. Thử trên Incognito mode
