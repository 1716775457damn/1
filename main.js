// 初始化轮播图
const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 5000,
    },
});

// 标题滚动效果
function handleTitleScroll() {
    const heroContent = document.getElementById('heroContent');
    const scrollPosition = window.scrollY;
    const triggerPoint = window.innerHeight * 0.3;

    if (scrollPosition > triggerPoint) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translate(-50%, -100%) scale(0.5)';
        setTimeout(() => {
            heroContent.style.visibility = 'hidden';
        }, 500);
    } else {
        heroContent.style.visibility = 'visible';
        const progress = scrollPosition / triggerPoint;
        const scale = 1 - (0.5 * progress);
        const opacity = 1 - progress;
        
        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
}

// 图片轮播
function initImageSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000);
}

// 事件监听
window.addEventListener('scroll', handleTitleScroll);
window.addEventListener('load', initImageSlider);

// 导航栏滚动效果
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const currentScrollTop = window.pageYOffset;
    
    // 向下滚动时隐藏导航栏，向上滚动时显示
    if (currentScrollTop > lastScrollTop) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = currentScrollTop;
});

// 平滑滚动到指定区域
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 添加页面加载动画
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// 聊天功能
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        addMessage(message, 'user');
        input.value = '';

        try {
            // 显示加载状态
            const loadingMessage = addMessage('正在思考...', 'ai');

            // 调用 Kimi API
            const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-AKTZlHsYOx7qyJtcNWWlkaTMspOua9c5LUCmfPSLVaXDuA1S'
                },
                body: JSON.stringify({
                    model: "moonshot-v1-8k",
                    messages: [
                        {
                            "role": "system",
                            "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。"
                        },
                        {
                            "role": "user",
                            "content": message
                        }
                    ],
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                throw new Error('API 请求失败');
            }

            const data = await response.json();

            // 移除加载消息
            loadingMessage.remove();

            // 添加 AI 回复
            addMessage(data.choices[0].message.content, 'ai');

        } catch (error) {
            console.error('Error:', error);
            addMessage('抱歉，发生了一些错误，请稍后再试。', 'ai');
        }
    }
}

function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    if (type === 'ai') {
        // 添加打字动画
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        chatMessages.appendChild(typingIndicator);
        
        // 模拟打字效果
        let index = 0;
        messageDiv.textContent = '';
        const typeWriter = setInterval(() => {
            if (index < text.length) {
                messageDiv.textContent += text.charAt(index);
                index++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                clearInterval(typeWriter);
                typingIndicator.remove();
            }
        }, 30);
    } else {
        messageDiv.textContent = text;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// 添加回车发送功能
document.getElementById('messageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 添加输入框焦点效果
const messageInput = document.getElementById('messageInput');
messageInput.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
});

messageInput.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
});

// 添加滚动显示动画
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom >= 0);
        
        if (isVisible) {
            element.classList.add('visible');
        }
    });
}

// 添加鼠标跟随效果
function initCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));
}

// 图片预览功能
function initImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    const previewImage = document.getElementById('previewImage');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let currentImageIndex = 0;

    // 打开预览
    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            previewImage.src = imgSrc;
            currentImageIndex = index;
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        });
    });

    // 关闭预览
    document.querySelector('.close-modal').addEventListener('click', closePreview);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePreview();
    });

    // 切换图片
    document.querySelector('.prev-image').addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + portfolioItems.length) % portfolioItems.length;
        updatePreviewImage();
    });

    document.querySelector('.next-image').addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % portfolioItems.length;
        updatePreviewImage();
    });

    function updatePreviewImage() {
        const newSrc = portfolioItems[currentImageIndex].querySelector('img').src;
        previewImage.style.opacity = '0';
        setTimeout(() => {
            previewImage.src = newSrc;
            previewImage.style.opacity = '1';
        }, 300);
    }

    function closePreview() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closePreview();
                break;
            case 'ArrowLeft':
                document.querySelector('.prev-image').click();
                break;
            case 'ArrowRight':
                document.querySelector('.next-image').click();
                break;
        }
    });
}

// 初始化
window.addEventListener('load', () => {
    initCursor();
    initImagePreview();
    // 为所有需要动画的元素添加 fade-in 类
    document.querySelectorAll('.portfolio-item, .section-content h2').forEach(el => {
        el.classList.add('fade-in');
    });
});

window.addEventListener('scroll', handleScrollAnimation);

// 导航菜单控制
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// 导航链接高亮
const navLinksArray = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function setActiveLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight/3)) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);
