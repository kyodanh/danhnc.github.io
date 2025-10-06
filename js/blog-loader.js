// Blog Posts Loader from Firebase
// Tích hợp vào trang blog để hiển thị bài viết từ Firebase

function initBlogLoader() {
    console.log('=== Blog Loader Init ===');
    console.log('DOM ready state:', document.readyState);

    // Check if we're on a blog page
    // For blog.html: look for #blog-posts-container
    // For blog-latest.html: look for .media-grid
    const blogContainer = document.querySelector('#blog-posts-container') || document.querySelector('.media-grid');
    console.log('Blog container found:', blogContainer);

    if (!blogContainer) {
        console.log('No blog container found on this page');
        return;
    }

    console.log('Starting Firebase check...');
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds total

    // Wait for Firebase to load
    const checkFirebase = setInterval(() => {
        attempts++;
        console.log(`Checking Firebase (attempt ${attempts})...`, {
            firebaseDB: typeof window.firebaseDB,
            firebase: typeof firebase,
            firebaseApps: typeof firebase !== 'undefined' ? firebase.apps.length : 0
        });

        if (typeof window.firebaseDB !== 'undefined' && window.firebaseDB !== null) {
            console.log('✅ Firebase loaded! Starting to load posts...');
            clearInterval(checkFirebase);
            loadBlogPosts();
        } else if (attempts >= maxAttempts) {
            console.error('❌ Firebase not loaded after 5 seconds');
            clearInterval(checkFirebase);
            blogContainer.innerHTML = '<p style="text-align: center; color: red;">Lỗi tải Firebase. Vui lòng refresh trang.</p>';
        }
    }, 100);
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogLoader);
} else {
    // DOM already loaded
    initBlogLoader();
}

// Also try on window load as fallback
window.addEventListener('load', function() {
    console.log('Window loaded event fired');
    const container = document.querySelector('#blog-posts-container') || document.querySelector('.media-grid');
    if (container) {
        // Check if container is still showing loading message
        if (container.innerHTML.includes('Đang tải bài viết') || container.innerHTML.includes('Runaway A Road Adventure')) {
            console.log('Blog not loaded yet, trying to load...');
            initBlogLoader();
        }
    }
});

async function loadBlogPosts() {
    console.log('loadBlogPosts called');
    const blogContainer = document.querySelector('#blog-posts-container') || document.querySelector('.media-grid');

    if (!blogContainer) {
        console.error('Blog container not found in loadBlogPosts');
        return;
    }

    // Show loading
    console.log('Showing loading state...');
    blogContainer.innerHTML = '<div style="text-align: center; padding: 60px 20px;"><div class="spinner"></div><p>Đang tải bài viết...</p></div>';

    try {
        console.log('Fetching posts from Firebase...');
        const snapshot = await firebaseDB.collection('posts')
            .orderBy('createdAt', 'desc')
            .get();

        console.log('Snapshot received:', snapshot.size, 'posts');

        if (snapshot.empty) {
            console.log('No posts found');
            blogContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Chưa có bài viết nào.</p>';
            return;
        }

        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log('Posts data:', posts);
        renderBlogPosts(posts, blogContainer);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogContainer.innerHTML = '<p style="text-align: center; color: red;">Lỗi tải bài viết: ' + error.message + '</p>';
    }
}

function renderBlogPosts(posts, container) {
    // Check if it's grid or list layout
    const isGrid = container.classList.contains('media-grid');

    if (isGrid) {
        // Grid Layout (blog-latest.html style)
        container.innerHTML = posts.map(post => `
            <article class="item post format-standard">
                <div class="media-container">
                    <a class="media-image-link" href="blog-single.html?id=${post.id}">
                        <img src="${post.image || 'images/blog/default.jpg'}" alt="${post.title}">
                    </a>
                </div>
                <div class="media-content-container">
                    <h3 class="media-title">
                        <a href="blog-single.html?id=${post.id}">${post.title}</a>
                    </h3>
                    <div class="media-meta">
                        <span class="media-date">${formatBlogDate(post.createdAt)}</span>
                        <span class="media-category">${post.category}</span>
                    </div>
                </div>
            </article>
        `).join('');
    } else {
        // List Layout (blog.html style)
        container.innerHTML = posts.map(post => `
            <article class="item post format-standard">
                <header class="entry-header">
                    <div class="entry-thumbnail">
                        <a href="blog-single.html?id=${post.id}">
                            <img src="${post.image || 'images/blog/default.jpg'}" alt="${post.title}">
                        </a>
                    </div>
                    <div class="entry-details">
                        <h2 class="entry-title">
                            <a href="blog-single.html?id=${post.id}">${post.title}</a>
                        </h2>
                        <div class="entry-meta">
                            <span class="entry-date">${formatBlogDate(post.createdAt)}</span>
                            <span class="entry-category">${post.category}</span>
                        </div>
                    </div>
                </header>
                <div class="entry-content">
                    <p>${post.excerpt}</p>
                    <a href="blog-single.html?id=${post.id}" class="more-link">Đọc tiếp</a>
                </div>
                ${post.tags && post.tags.length > 0 ? `
                <footer class="entry-footer">
                    <div class="entry-tags">
                        ${post.tags.map(tag => `<a href="#" class="tag">${tag}</a>`).join(' ')}
                    </div>
                </footer>
                ` : ''}
            </article>
        `).join('');
    }

    // Re-initialize isotope if exists
    if (typeof jQuery !== 'undefined' && jQuery.fn.isotope) {
        jQuery(container).isotope('reloadItems').isotope();
    }
}

function formatBlogDate(timestamp) {
    if (!timestamp) return '';

    const date = timestamp.toDate();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
}

// Single Post Loader
async function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) return;

    const titleElement = document.querySelector('.entry-title');
    const contentElement = document.querySelector('.entry-content');
    const metaElement = document.querySelector('.entry-meta');
    const imageElement = document.querySelector('.entry-thumbnail img');

    if (!contentElement) return;

    try {
        const doc = await firebaseDB.collection('posts').doc(postId).get();

        if (!doc.exists) {
            contentElement.innerHTML = '<p>Bài viết không tồn tại.</p>';
            return;
        }

        const post = doc.data();

        if (titleElement) titleElement.textContent = post.title;
        if (contentElement) contentElement.innerHTML = post.content;
        if (imageElement && post.image) imageElement.src = post.image;

        if (metaElement) {
            metaElement.innerHTML = `
                <span class="entry-date">${formatBlogDate(post.createdAt)}</span>
                <span class="entry-category">${post.category}</span>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="entry-tags">
                        ${post.tags.map(tag => `<a href="#" class="tag">${tag}</a>`).join(' ')}
                    </div>
                ` : ''}
            `;
        }

        // Update page title
        document.title = post.title + ' - DanhNCCV';
    } catch (error) {
        console.error('Error loading post:', error);
        if (contentElement) {
            contentElement.innerHTML = '<p>Lỗi tải bài viết. Vui lòng thử lại sau.</p>';
        }
    }
}

// Auto-load single post if on single post page
if (window.location.href.includes('blog-single.html')) {
    document.addEventListener('DOMContentLoaded', loadSinglePost);
}
