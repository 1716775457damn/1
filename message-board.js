document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messageList = document.getElementById('messageList');

    // 初始化 EmailJS
    emailjs.init("7sET974nLG0XYleE2"); // 更新为你的 Public Key

    // 从localStorage加载留言
    loadMessages();

    messageForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nickname = document.getElementById('nickname').value;
        const content = document.getElementById('messageContent').value;
        
        if (!nickname || !content) {
            alert('请填写完整信息！');
            return;
        }

        // 显示加载状态
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            // 使用 EmailJS 发送邮件
            await emailjs.send(
                "service_oaeqbqi", // 更新为你的 Service ID
                "template_p9jtm2d", // 更新为你的 Template ID
                {
                    to_email: "1716775457@qq.com",
                    from_name: nickname,
                    message: content
                }
            );

            // 创建新留言
            const message = {
                id: Date.now(),
                nickname: nickname,
                content: content,
                timestamp: new Date().toLocaleString()
            };

            // 保存留言
            saveMessage(message);
            
            // 重置表单
            messageForm.reset();
            
            // 刷新留言列表
            loadMessages();

            alert('留言发送成功！');
        } catch (error) {
            console.error('Error:', error);
            alert('留言发送失败，请稍后重试！');
        } finally {
            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });

    // 保存留言到localStorage
    function saveMessage(message) {
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.unshift(message); // 新消息添加到开头
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // 加载留言
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messageList.innerHTML = messages.map(message => `
            <div class="message-item">
                <div class="message-header">
                    <span class="message-nickname">${escapeHtml(message.nickname)}</span>
                    <span class="message-time">${message.timestamp}</span>
                </div>
                <div class="message-content">${escapeHtml(message.content)}</div>
            </div>
        `).join('');
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
}); 