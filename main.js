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
        // 当滚动超过触发点时，隐藏标题
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translate(-50%, -100%) scale(0.5)';
        setTimeout(() => {
            heroContent.style.display = 'none';
        }, 800); // 等待过渡动画完成后隐藏
    } else {
        // 回到顶部时显示标题
        heroContent.style.display = 'block';
        setTimeout(() => {
            const progress = scrollPosition / triggerPoint;
            const scale = 1 - (0.5 * progress);
            const topPosition = 50 - (progress * 50);
            heroContent.style.opacity = 1 - progress;
            heroContent.style.transform = `translate(-50%, -${topPosition}%) scale(${scale})`;
        }, 10);
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
