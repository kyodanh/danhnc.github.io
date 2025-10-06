# 🚀 Hướng dẫn chạy hệ thống Admin Blog

## Phương pháp 1: Sử dụng Python Web Server (Đơn giản nhất)

### Bước 1: Mở Terminal/CMD tại thư mục dự án

```bash
cd "/Users/nguyendanh/Desktop/Code Hoppy/danhnc.github.io"
```

### Bước 2: Chạy web server

```bash
python3 -m http.server 8000
```

### Bước 3: Mở trình duyệt

- Trang chủ: http://localhost:8000/index.html
- Admin login: http://localhost:8000/admin-login.html
- Blog: http://localhost:8000/blog.html

---

## Phương pháp 2: Sử dụng Live Server (VS Code)

### Bước 1: Cài đặt Live Server

1. Mở VS Code
2. Vào Extensions (Ctrl/Cmd + Shift + X)
3. Tìm "Live Server" by Ritwick Dey
4. Click Install

### Bước 2: Chạy Live Server

1. Click phải vào file `index.html`
2. Chọn "Open with Live Server"
3. Website sẽ tự động mở tại: http://127.0.0.1:5500

### Bước 3: Truy cập Admin

- Admin: http://127.0.0.1:5500/admin-login.html

---

## Phương pháp 3: Sử dụng NPM http-server (Nếu có Node.js)

### Bước 1: Cài đặt http-server (chỉ 1 lần)

```bash
npm install -g http-server
```

### Bước 2: Chạy server

```bash
http-server -p 8080
```

### Bước 3: Truy cập

- Trang chủ: http://localhost:8080/index.html
- Admin: http://localhost:8080/admin-login.html

---

## ⚙️ Thiết lập Firebase (Quan trọng!)

### Bước 1: Tạo tài khoản Admin

1. Truy cập: https://console.firebase.google.com/
2. Chọn project **blog-7acf4**
3. Vào **Authentication** → Tab **Users**
4. Click **Add user**
5. Nhập:
   - Email: `admin@yourdomain.com` (hoặc email bạn muốn)
   - Password: Mật khẩu mạnh (ít nhất 6 ký tự)
6. Click **Add user**

**⚠️ Nhớ email và password này để đăng nhập!**

### Bước 2: Thiết lập Firestore Database

1. Vào **Firestore Database** (sidebar trái)
2. Click **Create database**
3. Chọn **Start in test mode**
4. Location: **asia-southeast1** (Singapore)
5. Click **Enable**

### Bước 3: Cấu hình Security Rules

1. Vào tab **Rules**
2. Copy và paste code sau:

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

3. Click **Publish**

---

## 📝 Test hệ thống

### 1. Test đăng nhập Admin

1. Mở trình duyệt
2. Truy cập: http://localhost:8000/admin-login.html
3. Đăng nhập bằng email/password đã tạo
4. Nếu thành công → Chuyển sang Dashboard

### 2. Test tạo bài viết

1. Trong Dashboard, click **"Thêm bài mới"**
2. Điền thông tin:
   ```
   Tiêu đề: "Bài viết đầu tiên của tôi"
   Danh mục: "Technology"
   Tags: "test, blog, firebase"
   Ảnh URL: https://picsum.photos/800/400 (hoặc để trống)
   Mô tả: "Đây là bài viết test hệ thống admin..."
   Nội dung: "Nội dung chi tiết bài viết ở đây..."
   ```
3. Click **"Xuất bản bài viết"**
4. Kiểm tra bài viết trong **"Quản lý bài viết"**

### 3. Test hiển thị Blog

1. Mở tab mới
2. Truy cập: http://localhost:8000/blog.html
3. Bài viết vừa tạo sẽ hiển thị
4. Click vào bài viết để xem chi tiết

---

## 🔧 Troubleshooting (Xử lý lỗi)

### Lỗi: "Failed to load resource"

**Nguyên nhân:** Mở file HTML trực tiếp (file://)

**Giải pháp:** Phải chạy qua web server (http://localhost)

### Lỗi: "Firebase config not found"

**Nguyên nhân:** Chưa cấu hình Firebase

**Giải pháp:** Kiểm tra file `js/firebase-config.js` đã có thông tin đúng

### Lỗi đăng nhập: "User not found"

**Nguyên nhân:** Chưa tạo user trong Firebase Authentication

**Giải pháp:**
1. Vào Firebase Console
2. Authentication → Users → Add user
3. Tạo tài khoản admin

### Lỗi: "Missing or insufficient permissions"

**Nguyên nhân:** Firestore Rules chặn truy cập

**Giải pháp:**
1. Vào Firestore → Rules
2. Đảm bảo rules cho phép read public và write khi đã đăng nhập
3. Publish rules

### Bài viết không hiển thị

**Kiểm tra:**
1. Mở Console (F12) xem có lỗi gì
2. Đảm bảo Firestore đã được tạo
3. Đảm bảo có bài viết trong collection `posts`
4. Kiểm tra Security Rules đã publish

---

## 📱 Truy cập từ thiết bị khác (Mobile test)

### Bước 1: Tìm IP máy tính

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

### Bước 2: Chạy server với IP binding

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

### Bước 3: Truy cập từ mobile

Trên điện thoại (cùng WiFi), truy cập:
```
http://[IP_MÁY_TÍNH]:8000/admin-login.html
```

Ví dụ: http://192.168.1.100:8000/admin-login.html

---

## 🌐 Deploy lên Production

### Option 1: GitHub Pages (Miễn phí)

```bash
git add .
git commit -m "Add Firebase admin system"
git push origin master
```

Truy cập: `https://username.github.io/repo-name/admin-login.html`

### Option 2: Netlify (Miễn phí)

1. Kéo thả thư mục vào https://app.netlify.com/drop
2. Website sẽ có URL: `https://random-name.netlify.app`
3. Admin: `https://random-name.netlify.app/admin-login.html`

### Option 3: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🔐 Bảo mật Production

Khi deploy lên production, **BẮT BUỘC** cập nhật Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      // Chỉ cho admin email cụ thể được tạo/sửa/xóa
      allow create, update, delete: if request.auth != null &&
                                       request.auth.token.email == "admin@yourdomain.com";
    }
  }
}
```

⚠️ Thay `admin@yourdomain.com` bằng email admin thật của bạn!

---

## 📚 Tóm tắt URLs

| Trang | URL (Local) |
|-------|-------------|
| Trang chủ | http://localhost:8000/index.html |
| Admin Login | http://localhost:8000/admin-login.html |
| Admin Dashboard | http://localhost:8000/admin-dashboard.html |
| Blog List | http://localhost:8000/blog.html |
| Blog Latest | http://localhost:8000/blog-latest.html |
| Blog Single | http://localhost:8000/blog-single.html?id=POST_ID |

---

## 🎯 Quick Start (5 phút)

1. **Mở Terminal:**
   ```bash
   cd "/Users/nguyendanh/Desktop/Code Hoppy/danhnc.github.io"
   python3 -m http.server 8000
   ```

2. **Tạo Admin trong Firebase:**
   - Vào https://console.firebase.google.com/
   - Chọn project **blog-7acf4**
   - Authentication → Add user
   - Firestore → Create database (Test mode)

3. **Đăng nhập Admin:**
   - Mở http://localhost:8000/admin-login.html
   - Đăng nhập với tài khoản vừa tạo

4. **Tạo bài viết đầu tiên:**
   - Click "Thêm bài mới"
   - Điền thông tin và Xuất bản

5. **Xem kết quả:**
   - Mở http://localhost:8000/blog.html
   - Bài viết sẽ hiển thị

---

**Chúc bạn thành công! 🎉**
