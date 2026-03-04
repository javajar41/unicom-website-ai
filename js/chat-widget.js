/**
 * 中国联通官网 - 在线客服浮窗模块
 * 右下角按钮、对话框、常见问题自动回复
 */

(function() {
    'use strict';

    // 常见问题库
    const faqDatabase = {
        '套餐': {
            keywords: ['套餐', '资费', '费用', '多少钱', '价格'],
            answer: '我们提供多种5G套餐供您选择：\n• 5G畅享套餐 129元/月（30GB+500分钟）\n• 5G尊享套餐 199元/月（60GB+1000分钟）\n• 5G至尊套餐 299元/月（100GB+2000分钟）\n您可以在"套餐对比"区域找到最适合您的套餐！'
        },
        '宽带': {
            keywords: ['宽带', '光纤', '网络', 'wifi', '上网'],
            answer: '我们的智慧宽带提供以下选择：\n• 100M宽带 60元/月\n• 300M宽带 80元/月（推荐）\n• 500M宽带 120元/月\n• 1000M宽带 199元/月\n包含免费安装和专业设备！'
        },
        '5G': {
            keywords: ['5g', '5G', '信号', '覆盖', '网速'],
            answer: '中国联通5G已覆盖全国主要城市！\n• 下载速度可达1Gbps+\n• 北京、上海覆盖率超98%\n• 您可以首页查看实时5G覆盖地图\n• 支持使用网速测试工具测试您的网速'
        },
        '办理': {
            keywords: ['办理', '开通', '申请', '怎么买', '如何'],
            answer: '您可以通过以下方式办理业务：\n• 在线办理：选择套餐后点击"立即办理"\n• 营业厅：查询附近营业厅办理\n• 客服热线：10010\n• 手机APP：下载"中国联通"APP'
        },
        '流量': {
            keywords: ['流量', '数据', '上网', 'gb', 'GB'],
            answer: '关于流量使用：\n• 套餐内流量全国通用\n• 超出后按5元/GB计费\n• 可通过APP随时查询用量\n• 支持流量包叠加购买'
        },
        '客服': {
            keywords: ['客服', '电话', '人工', '帮助', '咨询'],
            answer: '需要帮助？\n• 在线客服：当前对话窗口\n• 客服热线：10010（24小时）\n• 营业厅：查询附近网点\n• APP客服：中国联通APP内咨询'
        },
        '投诉': {
            keywords: ['投诉', '问题', '反馈', '建议', '不满'],
            answer: '非常抱歉给您带来不便。\n• 在线投诉：请拨打10010按5\n• 工信部投诉：12300\n• 我们会尽快为您解决问题\n您的意见对我们很重要！'
        }
    };

    // 默认回复
    const defaultReplies = [
        '您好！我是联通智能客服，请问有什么可以帮助您？',
        '抱歉，我可能没理解您的问题。您可以尝试询问：套餐、宽带、5G、办理、流量等关键词。',
        '如需人工服务，请拨打客服热线：10010',
        '您可以查看更多详情，或告诉我您的具体需求~'
    ];

    class ChatWidget {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.init();
        }

        init() {
            this.render();
            this.bindEvents();
            this.addWelcomeMessage();
        }

        render() {
            // 创建客服浮窗
            const widget = document.createElement('div');
            widget.className = 'chat-widget-container';
            widget.innerHTML = `
                <div class="chat-window" id="chat-window">
                    <div class="chat-header">
                        <div class="chat-avatar">🤖</div>
                        <div class="chat-info">
                            <div class="chat-title">联通智能客服</div>
                            <div class="chat-status">
                                <span class="status-dot"></span>
                                在线
                            </div>
                        </div>
                        <button class="chat-close" id="chat-close">✕</button>
                    </div>
                    <div class="chat-messages" id="chat-messages">
                        <!-- 消息内容 -->
                    </div>
                    <div class="chat-quick-replies" id="chat-quick-replies">
                        <button class="quick-reply-btn" data-topic="套餐">📱 套餐咨询</button>
                        <button class="quick-reply-btn" data-topic="宽带">🏠 宽带办理</button>
                        <button class="quick-reply-btn" data-topic="5G">📶 5G覆盖</button>
                        <button class="quick-reply-btn" data-topic="客服">📞 联系客服</button>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" id="chat-input" 
                            placeholder="输入您的问题..." maxlength="200">
                        <button class="chat-send" id="chat-send">➤</button>
                    </div>
                </div>
                <button class="chat-toggle" id="chat-toggle">
                    <span class="toggle-icon">💬</span>
                    <span class="toggle-text">客服</span>
                    <span class="unread-badge" id="unread-badge">1</span>
                </button>
            `;
            document.body.appendChild(widget);
        }

        bindEvents() {
            // 切换按钮
            const toggleBtn = document.getElementById('chat-toggle');
            const closeBtn = document.getElementById('chat-close');
            const chatWindow = document.getElementById('chat-window');
            
            toggleBtn.addEventListener('click', () => this.toggle());
            closeBtn.addEventListener('click', () => this.close());

            // 发送消息
            const sendBtn = document.getElementById('chat-send');
            const input = document.getElementById('chat-input');
            
            sendBtn.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });

            // 快捷回复
            document.querySelectorAll('.quick-reply-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const topic = e.target.dataset.topic;
                    this.handleQuickReply(topic);
                });
            });

            // 点击外部关闭
            document.addEventListener('click', (e) => {
                if (this.isOpen && !e.target.closest('.chat-widget-container')) {
                    this.close();
                }
            });
        }

        toggle() {
            this.isOpen = !this.isOpen;
            const chatWindow = document.getElementById('chat-window');
            const toggleBtn = document.getElementById('chat-toggle');
            const unreadBadge = document.getElementById('unread-badge');
            
            if (this.isOpen) {
                chatWindow.classList.add('open');
                toggleBtn.classList.add('hidden');
                unreadBadge.style.display = 'none';
                this.scrollToBottom();
            } else {
                this.close();
            }
        }

        open() {
            this.isOpen = true;
            const chatWindow = document.getElementById('chat-window');
            const toggleBtn = document.getElementById('chat-toggle');
            const unreadBadge = document.getElementById('unread-badge');
            
            chatWindow.classList.add('open');
            toggleBtn.classList.add('hidden');
            unreadBadge.style.display = 'none';
            this.scrollToBottom();
        }

        close() {
            this.isOpen = false;
            const chatWindow = document.getElementById('chat-window');
            const toggleBtn = document.getElementById('chat-toggle');
            
            chatWindow.classList.remove('open');
            toggleBtn.classList.remove('hidden');
        }

        addWelcomeMessage() {
            this.addMessage('bot', defaultReplies[0]);
        }

        addMessage(type, content) {
            const messagesContainer = document.getElementById('chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${type}`;
            
            const time = new Date().toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            messageDiv.innerHTML = `
                <div class="message-bubble">
                    ${content.replace(/\n/g, '<br>')}
                </div>
                <div class="message-time">${time}</div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            this.scrollToBottom();
            
            // 保存消息记录
            this.messages.push({ type, content, time });
        }

        sendMessage() {
            const input = document.getElementById('chat-input');
            const text = input.value.trim();
            
            if (!text) return;
            
            // 添加用户消息
            this.addMessage('user', text);
            input.value = '';
            
            // 模拟客服输入中
            this.showTypingIndicator();
            
            // 生成回复
            setTimeout(() => {
                this.hideTypingIndicator();
                const reply = this.generateReply(text);
                this.addMessage('bot', reply);
            }, 1000 + Math.random() * 1000);
        }

        handleQuickReply(topic) {
            this.addMessage('user', topic + '咨询');
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.hideTypingIndicator();
                const reply = faqDatabase[topic]?.answer || defaultReplies[1];
                this.addMessage('bot', reply);
            }, 800);
        }

        generateReply(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            // 匹配关键词
            for (const [category, data] of Object.entries(faqDatabase)) {
                if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                    return data.answer;
                }
            }
            
            // 默认回复
            return defaultReplies[Math.floor(Math.random() * (defaultReplies.length - 1)) + 1];
        }

        showTypingIndicator() {
            const messagesContainer = document.getElementById('chat-messages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot typing';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-bubble">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            messagesContainer.appendChild(typingDiv);
            this.scrollToBottom();
        }

        hideTypingIndicator() {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
        }

        scrollToBottom() {
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // 初始化函数
    function initChatWidget() {
        window.chatWidget = new ChatWidget();
    }

    // 导出到全局
    window.ChatWidget = {
        ChatWidget,
        init: initChatWidget
    };

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }
})();
