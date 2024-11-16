document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;

        // 文字淡出效果
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const opacity = 1 - (currentScroll / 500); // 500px内完成淡出
            const scale = 1 - (currentScroll / 1000); // 缩放效果
            heroContent.style.opacity = opacity > 0 ? opacity : 0;
            heroContent.style.transform = `translate(-50%, -50%) scale(${scale > 0.5 ? scale : 0.5})`;
        }
    });

    // 首页轮播图
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }

    // 特色卡片点击跳转
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            switch(title) {
                case '在线商城':
                    window.location.href = 'shop.html';
                    break;
                case '项目展示':
                    window.location.href = 'portfolio.html';
                    break;
                case '联系我们':
                    window.location.href = 'contact.html';
                    break;
            }
        });
    });

    // 在 DOMContentLoaded 事件处理函数中添加以下代码
    function loadRecentMessages() {
        const messagesPreview = document.getElementById('messagesPreview');
        if (messagesPreview) {
            const messages = JSON.parse(localStorage.getItem('messages') || '[]');
            const recentMessages = messages.slice(0, 3); // 只显示最新的3条留言
            
            messagesPreview.innerHTML = recentMessages.map(message => `
                <div class="preview-message-item">
                    <div class="preview-message-header">
                        <span class="preview-message-nickname">${escapeHtml(message.nickname)}</span>
                        <span class="preview-message-time">${message.timestamp}</span>
                    </div>
                    <div class="preview-message-content">${escapeHtml(message.content)}</div>
                </div>
            `).join('');
        }
    }

    // 转义HTML防止XSS攻击
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 在页面加载时调用
    loadRecentMessages();

    const floatingContact = document.querySelector('.floating-contact');
    const contactTab = document.querySelector('.contact-tab');

    if (contactTab) {
        contactTab.addEventListener('click', () => {
            floatingContact.classList.toggle('active');
        });
    }

    // 点击其他地方关闭浮动窗口
    document.addEventListener('click', (e) => {
        if (floatingContact && !floatingContact.contains(e.target)) {
            floatingContact.classList.remove('active');
        }
    });

    const imagePreviewModal = document.getElementById('imagePreviewModal');
    const previewImage = document.getElementById('previewImage');
    const closeModal = document.querySelector('.close-modal');
    const wechatQRImage = document.querySelector('.wechat-qr img');

    // 点击二维码图片时打开预览
    if (wechatQRImage) {
        wechatQRImage.addEventListener('click', function() {
            previewImage.src = this.src;
            imagePreviewModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }

    // 点击关闭按钮关闭预览
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            imagePreviewModal.classList.remove('active');
            document.body.style.overflow = ''; // 恢复背景滚动
        });
    }

    // 点击预览图片本身也可以关闭预览
    if (previewImage) {
        previewImage.addEventListener('click', function() {
            imagePreviewModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // 点击模态框背景关闭预览
    if (imagePreviewModal) {
        imagePreviewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                imagePreviewModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ESC键关闭预览
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imagePreviewModal.classList.contains('active')) {
            imagePreviewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});