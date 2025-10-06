# Fix lỗi: Missing or insufficient permissions

## Lỗi hiện tại:
```
Error loading posts: FirebaseError: Missing or insufficient permissions
Error updating stats: FirebaseError: Missing or insufficient permissions
```

## Nguyên nhân:
Firestore Rules đang chặn việc đọc dữ liệu công khai

## Giải pháp (Làm chính xác theo thứ tự):

### Bước 1: Sửa FIRESTORE DATABASE RULES

1. Vào: https://console.firebase.google.com/project/blog-7acf4/firestore/rules

2. **XÓA HẾT** rules cũ

3. **COPY CHÍNH XÁC** code sau (9 dòng):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

4. **PASTE** vào editor

5. Click **"Publish"** (nút màu xanh)

6. Đảm bảo không có lỗi đỏ

### Bước 2: Sửa FIREBASE STORAGE RULES

1. Vào: https://console.firebase.google.com/project/blog-7acf4/storage

2. **NẾU chưa có Storage**: Click "Get started" → Chọn location asia-southeast1 → Done

3. Vào tab **"Rules"**

4. **XÓA HẾT** rules cũ

5. **COPY CHÍNH XÁC** code sau (11 dòng):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
    }
    match /blog/{fileName} {
      allow write, delete: if request.auth != null;
    }
  }
}
```

6. **PASTE** vào editor

7. Click **"Publish"**

8. Đảm bảo không có lỗi đỏ

### Bước 3: Kiểm tra lại

Sau khi Publish cả 2 rules:

1. **Clear cache**: Cmd+Shift+R (Mac) hoặc Ctrl+Shift+R (Windows)

2. **Refresh trang**: https://kyodanh.github.io/danhnc.github.io/admin/

3. **Kiểm tra Console** (F12):
   - Không còn lỗi "Missing or insufficient permissions"
   - Thấy "Firebase services initialized successfully"

4. **Test upload**:
   - Đăng nhập admin
   - Click "Thêm bài mới"
   - Chọn file upload
   - Kiểm tra không lỗi 404 hoặc permission

---

## Nếu vẫn lỗi:

### Lỗi: "Missing or insufficient permissions"
→ **Firestore Rules chưa đúng**. Kiểm tra lại Bước 1.

### Lỗi: "404 Not Found" khi upload
→ **Storage chưa được khởi tạo** hoặc **Storage Rules chưa đúng**. Kiểm tra lại Bước 2.

### Lỗi: CORS
→ Chờ vài phút để rules áp dụng, sau đó hard refresh (Cmd+Shift+R)

---

## Screenshot để đối chiếu:

### Firestore Rules phải như thế này:
```
✅ rules_version = '2';
✅ service cloud.firestore {
✅   match /databases/{database}/documents {
✅     match /posts/{postId} {
✅       allow read: if true;
✅       allow create, update, delete: if request.auth != null;
✅     }
✅   }
✅ }
```

### Storage Rules phải như thế này:
```
✅ rules_version = '2';
✅ service firebase.storage {
✅   match /b/{bucket}/o {
✅     match /{allPaths=**} {
✅       allow read: if true;
✅     }
✅     match /blog/{fileName} {
✅       allow write, delete: if request.auth != null;
✅     }
✅   }
✅ }
```

---

## Sau khi fix xong:

Tính năng sẽ hoạt động:
- ✅ Đọc danh sách bài viết
- ✅ Xem thống kê
- ✅ Upload ảnh/video (sau khi đăng nhập)
- ✅ Tạo/sửa/xóa bài viết (sau khi đăng nhập)
