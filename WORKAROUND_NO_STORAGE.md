# Giải pháp thay thế: Không dùng Firebase Storage

Nếu không muốn/không thể dùng Firebase Storage, bạn có thể dùng các dịch vụ upload ảnh miễn phí khác.

## 🌟 Phương án 1: Imgur (KHUYẾN NGHỊ)

### Cách dùng:
1. Vào: https://imgur.com/upload
2. Upload ảnh (không cần đăng ký)
3. Click chuột phải vào ảnh → Copy image address
4. Paste URL vào ô "Ảnh đại diện URL" trong admin

### Ưu điểm:
- ✅ Miễn phí, không giới hạn
- ✅ Không cần đăng ký
- ✅ CDN nhanh
- ✅ Hỗ trợ cả GIF

## 🌟 Phương án 2: GitHub Repository

### Cách dùng:
1. Tạo folder `images/blog/uploads/` trong repo
2. Upload ảnh vào folder đó
3. Commit và push
4. URL sẽ là: `https://raw.githubusercontent.com/kyodanh/danhnc.github.io/master/images/blog/uploads/TEN-ANH.jpg`

### Ưu điểm:
- ✅ Miễn phí
- ✅ Ảnh nằm trong repo, dễ quản lý
- ✅ Không phụ thuộc bên thứ 3

### Nhược điểm:
- ❌ Phải push mỗi lần thêm ảnh
- ❌ Không real-time

## 🌟 Phương án 3: Cloudinary (Free tier)

### Cách dùng:
1. Đăng ký: https://cloudinary.com/users/register_free
2. Free: 25GB storage, 25GB bandwidth/month
3. Upload ảnh qua dashboard
4. Copy URL và paste vào admin

### Ưu điểm:
- ✅ Free tier rộng rãi
- ✅ Tự động optimize ảnh
- ✅ CDN toàn cầu
- ✅ Hỗ trợ video

## 🌟 Phương án 4: ImgBB

### Cách dùng:
1. Vào: https://imgbb.com/
2. Upload ảnh (không cần đăng ký)
3. Copy "Direct link"
4. Paste vào admin

### Ưu điểm:
- ✅ Không cần đăng ký
- ✅ Miễn phí
- ✅ UI đơn giản

---

## 📝 Cách sử dụng trong Admin:

1. Upload ảnh lên một trong các dịch vụ trên
2. Copy URL ảnh
3. Vào Admin → Thêm bài mới
4. Trong phần **"Ảnh/Video đại diện"**
5. **BỎ QUA** nút "Chọn file từ máy tính"
6. **Paste URL** vào ô text bên dưới
7. Điền các thông tin khác và publish

---

## 🔧 Tắt tính năng Upload (Nếu muốn)

Nếu không muốn hiện nút upload, sửa file `admin/dashboard.html`:

Tìm dòng 130:
```html
<button type="button" class="btn-upload" onclick="document.getElementById('postImageFile').click()">
    <i class="icon-upload"></i> Chọn file từ máy tính
</button>
```

Thay bằng:
```html
<!-- Upload disabled - Use external image URLs instead -->
```

---

## ⚠️ LƯU Ý VỀ FIREBASE STORAGE:

Firebase Storage **HOÀN TOÀN MIỄN PHÍ** trên Spark plan:
- 5GB storage
- 1GB/day bandwidth
- Không cần thẻ tín dụng

Nếu bạn thấy thông báo phải "upgrade", đó có thể là:
1. Thông báo quảng cáo Blaze plan → Bỏ qua
2. Project đã vượt quota → Kiểm tra usage
3. Nhầm lẫn với App Hosting → Vào đúng menu Storage

Hãy chụp screenshot thông báo để tôi kiểm tra chính xác!
