# Hướng dẫn cấu hình Firebase cho Admin Blog

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Đăng nhập bằng tài khoản Google
3. Click **"Add project"** hoặc **"Thêm dự án"**
4. Đặt tên project (VD: `danhnc-portfolio`)
5. Tắt Google Analytics (không bắt buộc)
6. Click **"Create project"**

## Bước 2: Đăng ký Web App

1. Trong Firebase Console, click vào biểu tượng **Web** `</>`
2. Đặt tên app (VD: `DanhNC Blog`)
3. **KHÔNG** chọn Firebase Hosting (vì bạn đang dùng GitHub Pages)
4. Click **"Register app"**

## Bước 3: Lấy Firebase Config

Sau khi đăng ký, bạn sẽ thấy code config như sau:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Copy config này và thay vào file `js/firebase-config.js`

Mở file `js/firebase-config.js` và thay thế:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",  // ← Thay bằng apiKey của bạn
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // ← Thay bằng authDomain
    projectId: "YOUR_PROJECT_ID",  // ← Thay bằng projectId
    storageBucket: "YOUR_PROJECT_ID.appspot.com",  // ← Thay bằng storageBucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // ← Thay bằng messagingSenderId
    appId: "YOUR_APP_ID"  // ← Thay bằng appId
};
```

## Bước 4: Kích hoạt Authentication

1. Trong Firebase Console, vào **Authentication** ở sidebar trái
2. Click **"Get started"**
3. Chọn tab **"Sign-in method"**
4. Bật **"Email/Password"**
   - Click vào "Email/Password"
   - Toggle ON
   - Save

## Bước 5: Tạo tài khoản Admin

1. Vẫn ở **Authentication** → Tab **"Users"**
2. Click **"Add user"**
3. Nhập:
   - **Email**: admin@example.com (hoặc email bạn muốn)
   - **Password**: Mật khẩu mạnh (ít nhất 6 ký tự)
4. Click **"Add user"**

**Lưu ý**: Nhớ email và password này để đăng nhập vào trang admin!

## Bước 6: Thiết lập Firebase Storage

1. Trong Firebase Console, vào **Storage**
2. Click **"Get started"**
3. Chọn **"Start in test mode"**
4. Chọn location: `asia-southeast1` (Singapore)
5. Click **"Done"**

### Cấu hình Storage Rules (Quan trọng!)

1. Trong Storage, vào tab **"Rules"**
2. Thay rules bằng code sau:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read files
    match /{allPaths=**} {
      allow read: if true;
    }

    // Only authenticated users can write/delete
    match /blog/{fileName} {
      allow write, delete: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Bước 7: Thiết lập Firestore Database

1. Trong Firebase Console, vào **Firestore Database**
2. Click **"Create database"**
3. Chọn **"Start in test mode"** (để test, sau này sẽ bảo mật)
4. Chọn location: `asia-southeast1` (Singapore - gần Việt Nam nhất)
5. Click **"Enable"**

### Cấu hình Security Rules (Quan trọng!)

1. Trong Firestore, vào tab **"Rules"**
2. Thay rules bằng code sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts collection
    match /posts/{postId} {
      // Cho phép đọc công khai
      allow read: if true;

      // Chỉ cho phép user đã đăng nhập tạo/sửa/xóa
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Bước 8: Thêm Firebase vào các trang Blog

### Thêm vào `blog.html`:

Tìm dòng `<!-- SCRIPTS -->` và thêm trước `</body>`:

```html
<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="js/firebase-config.js"></script>
<script src="js/blog-loader.js"></script>
```

### Thêm vào `blog-latest.html`:

```html
<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="js/firebase-config.js"></script>
<script src="js/blog-loader.js"></script>
```

### Thêm vào `blog-single.html`:

```html
<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="js/firebase-config.js"></script>
<script src="js/blog-loader.js"></script>
```

## Bước 9: Test hệ thống

### 1. Test đăng nhập Admin:

1. Mở trình duyệt
2. Truy cập: `admin-login.html`
3. Đăng nhập bằng email/password đã tạo ở Bước 5
4. Nếu thành công → Chuyển sang `admin-dashboard.html`

### 2. Test tạo bài viết:

1. Trong Dashboard, click **"Thêm bài mới"**
2. Điền thông tin bài viết:
   - Tiêu đề: "Bài viết đầu tiên"
   - Danh mục: "Technology"
   - Tags: "test, firebase, blog"
   - Ảnh URL: (để trống hoặc paste link ảnh)
   - Mô tả ngắn: "Đây là bài viết test..."
   - Nội dung: "Nội dung chi tiết bài viết..."
3. Click **"Xuất bản bài viết"**
4. Kiểm tra bài viết xuất hiện trong **"Quản lý bài viết"**

### 3. Test hiển thị Blog:

1. Mở tab mới
2. Truy cập: `blog.html` hoặc `blog-latest.html`
3. Bài viết vừa tạo sẽ hiển thị
4. Click vào bài viết để xem chi tiết

## Bước 10: Bảo mật (Production)

Khi deploy lên production, cập nhật Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null &&
                                       request.auth.token.email == "admin@example.com";
    }
  }
}
```

Thay `admin@example.com` bằng email admin thực của bạn.

### Storage Rules (Production):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access
    match /{allPaths=**} {
      allow read: if true;
    }

    // Only specific admin can write/delete
    match /blog/{fileName} {
      allow write, delete: if request.auth != null &&
                              request.auth.token.email == "admin@example.com";
    }
  }
}
```

Thay `admin@example.com` bằng email admin thực của bạn.

## Bước 11: Deploy lên GitHub Pages

1. Commit tất cả thay đổi:
```bash
git add .
git commit -m "Add Firebase admin panel"
git push origin master
```

2. Trong GitHub repo → Settings → Pages
3. Chọn branch `master` → Save
4. Website sẽ có URL: `https://username.github.io/repo-name`

## Truy cập Admin Panel

- **Trang đăng nhập**: `https://your-site.com/admin-login.html`
- **Dashboard**: `https://your-site.com/admin-dashboard.html` (tự động redirect nếu chưa đăng nhập)

## Tính năng Admin Panel

✅ **Đăng nhập an toàn** với Firebase Authentication
✅ **Quản lý bài viết**: Xem danh sách, tìm kiếm
✅ **Thêm bài mới**: Form đầy đủ với tiêu đề, nội dung, ảnh, tags
✅ **Upload file**: Upload ảnh, video, GIF từ máy tính lên Firebase Storage
✅ **Preview**: Xem trước ảnh/video trước khi đăng
✅ **Progress bar**: Hiển thị tiến trình upload
✅ **Chỉnh sửa bài**: Click icon edit để sửa bài viết
✅ **Xóa bài**: Xác nhận trước khi xóa
✅ **Responsive**: Hoạt động tốt trên mobile
✅ **Thống kê**: Hiển thị tổng số bài viết
✅ **Đổi mật khẩu**: Trong phần Cài đặt

## Lưu ý quan trọng

⚠️ **KHÔNG** commit file `firebase-config.js` có thông tin thật lên GitHub public repo
⚠️ Sử dụng **Environment Variables** hoặc **.env** file cho production
⚠️ Luôn backup database định kỳ
⚠️ Cập nhật Security Rules phù hợp khi deploy

## Hỗ trợ

Nếu gặp lỗi:
1. Kiểm tra Console (F12) xem lỗi gì
2. Đảm bảo Firebase config đúng
3. Kiểm tra Authentication đã bật Email/Password
4. Kiểm tra Firestore Rules đã publish

## Tài liệu tham khảo

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
