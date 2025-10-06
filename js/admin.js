// Admin Dashboard Handler
let currentUser = null;
let posts = [];
let editingPostId = null;
let uploadedFileURL = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    setTimeout(() => {
        if (!window.firebaseAuth) {
            console.error('Firebase not loaded!');
            return;
        }

        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                initDashboard();
            } else {
                window.location.href = '/admin/';
            }
        });
    }, 500);

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await firebaseAuth.signOut();
                window.location.href = '/admin/';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }

    // Post form submission
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            postForm.reset();
            editingPostId = null;
            switchSection('posts');
        });
    }

    // Search posts
    const searchInput = document.getElementById('searchPosts');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.category.toLowerCase().includes(query)
            );
            renderPosts(filtered);
        });
    }

    // Change password
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.btn-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // File upload handler
    const fileInput = document.getElementById('postImageFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
});

// Initialize Dashboard
function initDashboard() {
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('settingsEmail').textContent = currentUser.email;
    loadPosts();
    updateStats();
}

// Switch Section
function switchSection(section) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.classList.remove('active'));

    const pageTitle = document.getElementById('pageTitle');

    switch(section) {
        case 'posts':
            document.getElementById('postsSection').classList.add('active');
            pageTitle.textContent = 'Quản lý bài viết';
            break;
        case 'new-post':
            document.getElementById('newPostSection').classList.add('active');
            pageTitle.textContent = editingPostId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới';
            break;
        case 'settings':
            document.getElementById('settingsSection').classList.add('active');
            pageTitle.textContent = 'Cài đặt';
            break;
    }
}

// Load Posts from Firebase
async function loadPosts() {
    const postsGrid = document.getElementById('postsGrid');
    postsGrid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Đang tải bài viết...</p></div>';

    try {
        const snapshot = await firebaseDB.collection('posts').orderBy('createdAt', 'desc').get();
        posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderPosts(posts);
        updateStats();
    } catch (error) {
        console.error('Error loading posts:', error);
        postsGrid.innerHTML = '<p style="text-align: center; color: #ef4444;">Lỗi tải bài viết. Vui lòng thử lại.</p>';
    }
}

// Render Posts
function renderPosts(postsToRender) {
    const postsGrid = document.getElementById('postsGrid');

    if (postsToRender.length === 0) {
        postsGrid.innerHTML = '<p style="text-align: center; color: #64748b; grid-column: 1/-1;">Chưa có bài viết nào.</p>';
        return;
    }

    postsGrid.innerHTML = postsToRender.map(post => `
        <div class="post-card" data-id="${post.id}">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-card-image">` : '<div class="post-card-image"></div>'}
            <div class="post-card-content">
                <span class="post-card-category">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${post.excerpt.substring(0, 100)}...</p>
                <div class="post-card-meta">
                    <span>${formatDate(post.createdAt)}</span>
                    <div class="post-card-actions">
                        <button class="btn-icon edit" onclick="editPost('${post.id}')">
                            <i class="icon-pencil"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deletePost('${post.id}')">
                            <i class="icon-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle Post Submit
async function handlePostSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const tags = document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(t => t);
    const image = document.getElementById('postImage').value;
    const excerpt = document.getElementById('postExcerpt').value;
    const content = document.getElementById('postContent').value;

    const btnText = e.target.querySelector('.btn-text');
    const btnLoader = e.target.querySelector('.btn-loader');
    const submitBtn = e.target.querySelector('.btn-primary');

    // Show loading
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    submitBtn.disabled = true;

    const postData = {
        title,
        category,
        tags,
        image: image || 'images/blog/default.jpg',
        excerpt,
        content,
        author: currentUser.email,
        updatedAt: firebase.firestore.Timestamp.now()
    };

    try {
        if (editingPostId) {
            // Update existing post
            await firebaseDB.collection('posts').doc(editingPostId).update(postData);
            alert('Cập nhật bài viết thành công!');
        } else {
            // Create new post
            postData.createdAt = firebase.firestore.Timestamp.now();
            await firebaseDB.collection('posts').add(postData);
            alert('Xuất bản bài viết thành công!');
        }

        document.getElementById('postForm').reset();
        editingPostId = null;
        loadPosts();
        switchSection('posts');
    } catch (error) {
        console.error('Error saving post:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Edit Post
window.editPost = async function(postId) {
    editingPostId = postId;
    const post = posts.find(p => p.id === postId);

    if (!post) return;

    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postTags').value = post.tags ? post.tags.join(', ') : '';
    document.getElementById('postImage').value = post.image;
    document.getElementById('postExcerpt').value = post.excerpt;
    document.getElementById('postContent').value = post.content;

    switchSection('new-post');
    document.querySelector('[data-section="new-post"]').click();
}

// Delete Post
window.deletePost = function(postId) {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('active');

    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = async () => {
        try {
            await firebaseDB.collection('posts').doc(postId).delete();
            alert('Xóa bài viết thành công!');
            loadPosts();
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Có lỗi xảy ra khi xóa bài viết.');
        }
    };
}

window.closeDeleteModal = function() {
    document.getElementById('deleteModal').classList.remove('active');
}

// Change Password
async function handleChangePassword(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;

    try {
        await currentUser.updatePassword(newPassword);
        alert('Đổi mật khẩu thành công!');
        document.getElementById('changePasswordForm').reset();
    } catch (error) {
        console.error('Error changing password:', error);
        if (error.code === 'auth/requires-recent-login') {
            alert('Vui lòng đăng xuất và đăng nhập lại để đổi mật khẩu.');
        } else {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
}

// Update Stats
async function updateStats() {
    try {
        const snapshot = await firebaseDB.collection('posts').get();
        const total = snapshot.size;
        document.getElementById('totalPosts').textContent = total;
        document.getElementById('publishedPosts').textContent = total;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Format Date
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===================================
// FILE UPLOAD FUNCTIONS
// ===================================

// Handle file selection
async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
        alert('Chỉ hỗ trợ file ảnh (JPEG, PNG, GIF, WEBP) và video (MP4, WEBM)!');
        return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.');
        return;
    }

    // Upload file
    await uploadFile(file);
}

// Upload file to Firebase Storage
async function uploadFile(file) {
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const uploadStatus = document.getElementById('uploadStatus');
    const imagePreview = document.getElementById('imagePreview');

    // Show progress
    uploadProgress.style.display = 'block';
    uploadStatus.textContent = 'Đang upload...';
    progressFill.style.width = '0%';

    try {
        // Create unique filename
        const timestamp = Date.now();
        const filename = `blog/${timestamp}_${file.name}`;

        // Get storage reference
        const storageRef = window.firebaseStorage.ref(filename);

        // Upload file
        const uploadTask = storageRef.put(file);

        // Track upload progress
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressFill.style.width = progress + '%';
                uploadStatus.textContent = `Đang upload... ${Math.round(progress)}%`;
            },
            (error) => {
                console.error('Upload error:', error);
                uploadStatus.textContent = 'Lỗi upload file!';
                uploadStatus.style.color = 'var(--danger-color)';
                setTimeout(() => {
                    uploadProgress.style.display = 'none';
                }, 2000);
            },
            async () => {
                // Upload completed
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                uploadedFileURL = downloadURL;

                // Update URL input
                document.getElementById('postImage').value = downloadURL;

                // Show preview
                showFilePreview(file, downloadURL);

                // Hide progress, show success
                uploadStatus.textContent = 'Upload thành công!';
                uploadStatus.style.color = 'var(--success-color)';

                setTimeout(() => {
                    uploadProgress.style.display = 'none';
                }, 2000);
            }
        );

    } catch (error) {
        console.error('Upload error:', error);
        uploadStatus.textContent = 'Lỗi upload file!';
        uploadStatus.style.color = 'var(--danger-color)';
    }
}

// Show file preview
function showFilePreview(file, url) {
    const imagePreview = document.getElementById('imagePreview');
    const isVideo = file.type.startsWith('video/');

    imagePreview.innerHTML = `
        ${isVideo ?
            `<video src="${url}" controls style="width: 100%; max-height: 300px;"></video>` :
            `<img src="${url}" alt="Preview" />`
        }
        <button type="button" class="preview-remove" onclick="removeUploadedFile()">
            <i class="icon-trash"></i> Xóa file
        </button>
    `;
}

// Remove uploaded file
window.removeUploadedFile = async function() {
    if (!uploadedFileURL) return;

    if (!confirm('Bạn có chắc muốn xóa file đã upload?')) return;

    try {
        // Delete from storage
        const storageRef = window.firebaseStorage.refFromURL(uploadedFileURL);
        await storageRef.delete();

        // Clear preview and input
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('postImage').value = '';
        document.getElementById('postImageFile').value = '';
        uploadedFileURL = null;

        alert('Đã xóa file thành công!');
    } catch (error) {
        console.error('Error deleting file:', error);
        // File might not exist, just clear the UI
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('postImage').value = '';
        document.getElementById('postImageFile').value = '';
        uploadedFileURL = null;
    }
}
