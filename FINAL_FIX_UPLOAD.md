# FIX TRIỆT ĐỂ - Upload không hoạt động

## Vấn đề: Upload ảnh bị lỗi 404

## Nguyên nhân: Firebase Storage chưa được khởi tạo

---

## ✅ GIẢI PHÁP ĐƠN GIẢN NHẤT (Không cần gcloud):

### Cách 1: Tạo Storage qua Firebase Console (KHUYẾN NGHỊ)

#### Bước 1: Vào Firebase Console
https://console.firebase.google.com/project/blog-7acf4/storage

#### Bước 2: Xem màn hình hiện gì

**TH1: Nếu thấy nút "Get started"**
1. Click "Get started"
2. Chọn "Start in production mode"
3. Location: asia-southeast1
4. Click "Done"
5. **QUAN TRỌNG:** Đợi đến khi thấy bucket được tạo (sẽ hiện tên bucket)

**TH2: Nếu đã có bucket (thấy tên gs://...)**
→ Storage đã được tạo rồi, chuyển sang Bước 3

#### Bước 3: Set Storage Rules

1. Click tab **"Rules"** (ở thanh menu trên)
2. Xóa hết code cũ
3. Copy CHÍNH XÁC 7 dòng này:

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

4. Paste vào
5. Click **"Publish"** (nút màu xanh)
6. Đảm bảo không có lỗi đỏ

#### Bước 4: Kiểm tra bucket name

Vào tab "Files", bạn sẽ thấy bucket name dạng:
- `gs://blog-7acf4.appspot.com` (cũ)
- `gs://blog-7acf4.firebasestorage.app` (mới)

**Copy tên này** (bỏ gs://) và kiểm tra xem có khớp với `firebase-config.js` không.

#### Bước 5: Verify trong code

Mở file `js/firebase-config.js`, dòng 6 phải giống bucket name:

```javascript
storageBucket: "blog-7acf4.firebasestorage.app",  // ← Phải khớp với bucket
```

Nếu khác, sửa lại cho đúng.

---

### Cách 2: Set CORS (Nếu Cách 1 chưa đủ)

**Chỉ cần làm nếu upload vẫn bị CORS error**

#### Option A: Dùng gcloud (Cho developer)

```bash
# 1. Authenticate
/Users/nguyendanh/google-cloud-sdk/bin/gcloud auth login

# 2. Set project
/Users/nguyendanh/google-cloud-sdk/bin/gcloud config set project blog-7acf4

# 3. Set CORS
cd /Users/nguyendanh/Desktop/Code\ Hoppy/danhnc.github.io
/Users/nguyendanh/google-cloud-sdk/bin/gsutil cors set cors.json gs://blog-7acf4.firebasestorage.app
```

#### Option B: Tạo file thủ công qua Console

1. Vào: https://console.cloud.google.com/storage/browser?project=blog-7acf4
2. Click vào bucket `blog-7acf4.firebasestorage.app`
3. Tab "Configuration"
4. Scroll xuống "CORS"
5. Click "Edit" và paste:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

6. Save

---

## 🧪 TEST SAU KHI FIX:

### Bước 1: Clear cache
Cmd+Shift+R (Mac) hoặc Ctrl+Shift+R (Windows)

### Bước 2: Mở admin
https://kyodanh.github.io/danhnc.github.io/admin/dashboard.html

### Bước 3: Đăng nhập
Email: admin@gmail.com (hoặc email bạn đã tạo)

### Bước 4: Test upload
1. Click "Thêm bài mới"
2. Trong phần "Ảnh/Video đại diện", click "Chọn file từ máy tính"
3. Chọn một ảnh nhỏ (dưới 1MB để test nhanh)
4. Xem console (F12) xem có lỗi không

### Bước 5: Kiểm tra kết quả

**Thành công nếu:**
- ✅ Thấy progress bar 0% → 100%
- ✅ Thấy "Upload thành công!"
- ✅ Preview ảnh hiển thị
- ✅ URL ảnh xuất hiện trong input box
- ✅ Không có lỗi đỏ trong Console

**Vẫn lỗi nếu:**
- ❌ Lỗi 404 → Storage chưa được tạo (quay lại Bước 1)
- ❌ Lỗi 403 → Storage Rules chưa đúng (quay lại Bước 3)
- ❌ CORS error → Cần set CORS (làm Cách 2)

---

## 🆘 NÊU VẪN KHÔNG ĐƯỢC:

### 1. Chụp 3 screenshots:

**Screenshot 1: Firebase Storage Console**
- Vào: https://console.firebase.google.com/project/blog-7acf4/storage
- Tab "Files"
- Chụp toàn bộ màn hình

**Screenshot 2: Storage Rules**
- Tab "Rules"
- Chụp toàn bộ rules editor

**Screenshot 3: Console Error**
- Mở trang admin
- F12 → Console tab
- Thử upload file
- Chụp màn hình lỗi

### 2. Check firebase-config.js

Copy nội dung file `js/firebase-config.js` để xem bucket name có đúng không.

### 3. Thử upload thủ công

1. Vào: https://console.firebase.google.com/project/blog-7acf4/storage
2. Tab "Files"
3. Click "Upload file"
4. Chọn ảnh
5. Xem có upload được không
6. Nếu được → Rules đúng, vấn đề là CORS hoặc code
7. Nếu không → Rules chưa đúng

---

## 📝 Checklist hoàn chỉnh:

- [ ] Firebase Storage đã được khởi tạo (thấy bucket name)
- [ ] Storage Rules = allow read, write: if true
- [ ] Bucket name trong firebase-config.js khớp với Console
- [ ] Firestore Rules = allow read: if true
- [ ] Đã đăng nhập admin
- [ ] Đã clear cache browser
- [ ] Không có lỗi đỏ trong Console

Nếu tất cả đều ✅ mà vẫn không upload được, gửi 3 screenshots cho tôi!
