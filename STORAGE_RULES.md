# Firebase Storage Rules

## Test Mode (Cho phép upload mà không cần auth - CHỈ ĐỂ TEST)

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

**⚠️ LƯU Ý: Chỉ dùng để test! Sau khi test xong phải đổi về Production mode!**

## Production Mode (Bảo mật - Chỉ cho phép user đã đăng nhập upload)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Cho phép đọc công khai
    match /{allPaths=**} {
      allow read: if true;
    }

    // Chỉ cho phép user đã đăng nhập upload/xóa trong folder blog
    match /blog/{fileName} {
      allow write, delete: if request.auth != null;
    }
  }
}
```

## Strict Production Mode (Chỉ admin mới upload được)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Cho phép đọc công khai
    match /{allPaths=**} {
      allow read: if true;
    }

    // Chỉ cho phép admin upload/xóa
    match /blog/{fileName} {
      allow write, delete: if request.auth != null &&
                              request.auth.token.email == "admin@gmail.com";
    }
  }
}
```

**Thay `admin@gmail.com` bằng email admin thực của bạn.**

## Cách áp dụng:

1. Vào Firebase Console: https://console.firebase.google.com/project/blog-7acf4/storage
2. Click tab **"Rules"**
3. Copy một trong các rules ở trên
4. Paste vào editor
5. Click **"Publish"**

## Debug:

Nếu upload không hoạt động, hãy thử:

1. **Test Mode trước** (allow all) để xem có lỗi gì khác không
2. Kiểm tra Console (F12) xem có lỗi gì
3. Đảm bảo đã đăng nhập (nếu dùng Production mode)
4. Kiểm tra `storageBucket` trong firebase-config.js
