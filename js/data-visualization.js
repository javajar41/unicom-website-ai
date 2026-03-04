/**
 * 中国联通官网 - 数据可视化模块
 * 5G覆盖地图、在线用户数统计、网速测试工具
 */

(function() {
    'use strict';

    // 数字滚动动画类
    class CounterAnimation {
        constructor(element, options = {}) {
            this.element = element;
            this.target = parseInt(options.target) || 0;
            this.duration = options.duration || 2000;
            this.suffix = options.suffix || '';
            this.prefix = options.prefix || '';
            this.isRunning = false;
        }

        animate() {
            if (this.isRunning) return;
            this.isRunning = true;

            const startTime = performance.now();
            const startValue = 0;
            const range = this.target - startValue;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.duration, 1);
                
                // 使用缓动函数使动画更自然
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + range * easeOutQuart);
                
                this.element.textContent = this.prefix + this.formatNumber(currentValue) + this.suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    this.isRunning = false;
                    this.element.classList.add('updated');
                }
            };

            requestAnimationFrame(updateCounter);
        }

        formatNumber(num) {
            return num.toLocaleString('zh-CN');
        }

        updateTarget(newTarget) {
            this.target = parseInt(newTarget);
            this.animate();
        }
    }

    // 5G覆盖地图类
    class CoverageMap {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;
            
            this.provinces = [
                { name: '北京', x: 70, y: 35, coverage: 98 },
                { name: '上海', x: 80, y: 60, coverage: 99 },
                { name: '广东', x: 65, y: 80, coverage: 96 },
                { name: '浙江', x: 78, y: 65, coverage: 97 },
                { name: '江苏', x: 75, y: 55, coverage: 98 },
                { name: '四川', x: 45, y: 60, coverage: 94 },
                { name: '山东', x: 72, y: 45, coverage: 95 },
                { name: '河南', x: 65, y: 50, coverage: 93 },
                { name: '湖北', x: 60, y: 60, coverage: 94 },
                { name: '湖南', x: 58, y: 70, coverage: 93 },
                { name: '福建', x: 72, y: 75, coverage: 95 },
                { name: '安徽', x: 68, y: 58, coverage: 92 },
                { name: '河北', x: 68, y: 38, coverage: 94 },
                { name: '陕西', x: 52, y: 50, coverage: 91 },
                { name: '重庆', x: 48, y: 62, coverage: 95 },
                { name: '辽宁', x: 78, y: 28, coverage: 93 },
                { name: '天津', x: 72, y: 36, coverage: 97 },
                { name: '云南', x: 40, y: 75, coverage: 89 },
                { name: '贵州', x: 45, y: 70, coverage: 90 },
                { name: '江西', x: 65, y: 68, coverage: 91 },
                { name: '广西', x: 52, y: 80, coverage: 88 },
                { name: '山西', x: 60, y: 42, coverage: 90 },
                { name: '吉林', x: 82, y: 22, coverage: 89 },
                { name: '黑龙江', x: 85, y: 15, coverage: 87 },
                { name: '内蒙古', x: 55, y: 25, coverage: 85 },
                { name: '新疆', x: 20, y: 35, coverage: 82 },
                { name: '甘肃', x: 35, y: 45, coverage: 84 },
                { name: '海南', x: 58, y: 90, coverage: 92 },
                { name: '宁夏', x: 48, y: 42, coverage: 88 },
                { name: '青海', x: 30, y: 50, coverage: 80 },
                { name: '西藏', x: 25, y: 65, coverage: 75 },
                { name: '台湾', x: 82, y: 78, coverage: 98 },
                { name: '香港', x: 62, y: 82, coverage: 99 },
                { name: '澳门', x: 60, y: 83, coverage: 99 }
            ];
            
            this.init();
        }

        init() {
            this.render();
            this.animateDots();
        }

        render() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 100 100');
            svg.style.width = '100%';
            svg.style.height = '100%';
            
            // 添加渐变定义
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.innerHTML = `
                <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0052d9;stop-opacity:0" />
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            `;
            svg.appendChild(defs);
            
            // 渲染省份覆盖点
            this.provinces.forEach((province, index) => {
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', province.x);
                dot.setAttribute('cy', province.y);
                dot.setAttribute('r', Math.max(0.8, province.coverage / 30));
                dot.setAttribute('fill', this.getCoverageColor(province.coverage));
                dot.setAttribute('opacity', '0.8');
                dot.setAttribute('class', 'map-dot');
                dot.style.cursor = 'pointer';
                dot.style.transition = 'all 0.3s ease';
                
                // 添加悬停效果
                dot.addEventListener('mouseenter', () => {
                    dot.setAttribute('r', Math.max(1.2, province.coverage / 25));
                    dot.setAttribute('opacity', '1');
                    this.showTooltip(province);
                });
                
                dot.addEventListener('mouseleave', () => {
                    dot.setAttribute('r', Math.max(0.8, province.coverage / 30));
                    dot.setAttribute('opacity', '0.8');
                    this.hideTooltip();
                });
                
                // 添加脉冲动画
                const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                pulse.setAttribute('cx', province.x);
                pulse.setAttribute('cy', province.y);
                pulse.setAttribute('r', Math.max(0.8, province.coverage / 30));
                pulse.setAttribute('fill', 'none');
                pulse.setAttribute('stroke', this.getCoverageColor(province.coverage));
                pulse.setAttribute('stroke-width', '0.2');
                pulse.setAttribute('class', 'pulse-ring');
                pulse.style.animation = `mapPulse 2s ease-out infinite`;
                pulse.style.animationDelay = `${index * 0.1}s`;
                
                svg.appendChild(pulse);
                svg.appendChild(dot);
            });
            
            this.container.appendChild(svg);
            
            // 创建提示框
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'map-tooltip';
            this.tooltip.style.cssText = `
                position: absolute;
                background: var(--bg-card);
                border: 1px solid var(--border-accent);
                border-radius: 8px;
                padding: 10px 15px;
                font-size: 14px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1000;
                box-shadow: var(--shadow-md);
            `;
            this.container.appendChild(this.tooltip);
        }

        getCoverageColor(coverage) {
            if (coverage >= 95) return '#00d4ff';
            if (coverage >= 90) return '#00ff88';
            if (coverage >= 85) return '#ffd700';
            return '#ff6b6b';
        }

        showTooltip(province) {
            this.tooltip.innerHTML = `
                <strong>${province.name}</strong><br>
                5G覆盖率: ${province.coverage}%
            `;
            this.tooltip.style.opacity = '1';
        }

        hideTooltip() {
            this.tooltip.style.opacity = '0';
        }

        animateDots() {
            // 添加CSS动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes mapPulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 网速测试类
    class SpeedTest {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;
            
            this.isTesting = false;
            this.downloadSpeed = 0;
            this.uploadSpeed = 0;
            this.ping = 0;
            
            this.init();
        }

        init() {
            this.render();
            this.bindEvents();
        }

        render() {
            this.container.innerHTML = `
                <div class="speed-test-container">
                    <div class="speed-display">
                        <svg class="speed-ring-svg" viewBox="0 0 200 200">
                            <defs>
                                <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#0052d9" />
                                    <stop offset="100%" style="stop-color:#00d4ff" />
                                </linearGradient>
                            </defs>
                            <circle class="speed-ring-bg" cx="100" cy="100" r="80" fill="none" stroke="var(--border-color)" stroke-width="12"/>
                            <circle class="speed-ring-progress" cx="100" cy="100" r="80" fill="none" stroke="url(#speedGradient)" stroke-width="12" stroke-linecap="round" stroke-dasharray="502.65" stroke-dashoffset="502.65" transform="rotate(-90 100 100)"/>
                        </svg>
                        <div class="speed-value">
                            <span class="speed-number">0</span>
                            <span class="speed-unit">Mbps</span>
                        </div>
                    </div>
                    <div class="speed-details">
                        <div class="speed-item">
                            <span class="speed-label">下载</span>
                            <span class="speed-item-value" id="download-speed">0 Mbps</span>
                        </div>
                        <div class="speed-item">
                            <span class="speed-label">上传</span>
                            <span class="speed-item-value" id="upload-speed">0 Mbps</span>
                        </div>
                        <div class="speed-item">
                            <span class="speed-label">延迟</span>
                            <span class="speed-item-value" id="ping-value">0 ms</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-large speed-test-btn">
                        <span class="btn-text">开始测速</span>
                    </button>
                </div>
            `;
            
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .speed-test-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 40px;
                }
                .speed-display {
                    position: relative;
                    width: 200px;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .speed-ring-svg {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                .speed-ring-progress {
                    transition: stroke-dashoffset 0.3s ease;
                }
                .speed-value {
                    text-align: center;
                    z-index: 1;
                }
                .speed-number {
                    font-size: 48px;
                    font-weight: bold;
                    color: var(--text-accent);
                    display: block;
                }
                .speed-unit {
                    font-size: 16px;
                    color: var(--text-muted);
                }
                .speed-details {
                    display: flex;
                    gap: 40px;
                }
                .speed-item {
                    text-align: center;
                }
                .speed-label {
                    display: block;
                    font-size: 14px;
                    color: var(--text-muted);
                    margin-bottom: 5px;
                }
                .speed-item-value {
                    font-size: 20px;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .speed-test-btn {
                    min-width: 200px;
                }
                .speed-test-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                @media (max-width: 768px) {
                    .speed-details {
                        flex-direction: column;
                        gap: 20px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        bindEvents() {
            const btn = this.container.querySelector('.speed-test-btn');
            btn.addEventListener('click', () => this.startTest());
        }

        async startTest() {
            if (this.isTesting) return;
            
            this.isTesting = true;
            const btn = this.container.querySelector('.speed-test-btn');
            const btnText = btn.querySelector('.btn-text');
            btn.disabled = true;
            btnText.textContent = '测速中...';
            
            // 重置数值
            this.resetValues();
            
            // 测试延迟
            await this.testPing();
            
            // 测试下载速度
            await this.testDownload();
            
            // 测试上传速度
            await this.testUpload();
            
            // 完成
            this.isTesting = false;
            btn.disabled = false;
            btnText.textContent = '重新测速';
        }

        resetValues() {
            this.updateSpeedDisplay(0);
            document.getElementById('download-speed').textContent = '0 Mbps';
            document.getElementById('upload-speed').textContent = '0 Mbps';
            document.getElementById('ping-value').textContent = '0 ms';
        }

        async testPing() {
            // 模拟延迟测试
            const ping = Math.floor(Math.random() * 30) + 10;
            document.getElementById('ping-value').textContent = ping + ' ms';
            await this.delay(500);
        }

        async testDownload() {
            const targetSpeed = Math.floor(Math.random() * 500) + 200; // 200-700 Mbps
            const duration = 2000;
            const steps = 20;
            const stepDuration = duration / steps;
            
            for (let i = 0; i <= steps; i++) {
                const progress = i / steps;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentSpeed = Math.floor(targetSpeed * easeOut);
                
                this.updateSpeedDisplay(currentSpeed);
                document.getElementById('download-speed').textContent = currentSpeed + ' Mbps';
                
                await this.delay(stepDuration);
            }
        }

        async testUpload() {
            const targetSpeed = Math.floor(Math.random() * 100) + 50; // 50-150 Mbps
            const duration = 2000;
            const steps = 20;
            const stepDuration = duration / steps;
            
            for (let i = 0; i <= steps; i++) {
                const progress = i / steps;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentSpeed = Math.floor(targetSpeed * easeOut);
                
                this.updateSpeedDisplay(currentSpeed);
                document.getElementById('upload-speed').textContent = currentSpeed + ' Mbps';
                
                await this.delay(stepDuration);
            }
        }

        updateSpeedDisplay(speed) {
            const maxSpeed = 1000; // 最大显示1000Mbps
            const percentage = Math.min(speed / maxSpeed, 1);
            const circumference = 2 * Math.PI * 80; // 502.65
            const offset = circumference - (percentage * circumference);
            
            const progressRing = this.container.querySelector('.speed-ring-progress');
            const speedNumber = this.container.querySelector('.speed-number');
            
            if (progressRing) {
                progressRing.style.strokeDashoffset = offset;
            }
            if (speedNumber) {
                speedNumber.textContent = speed;
            }
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // 在线用户统计
    class UserStats {
        constructor(containerId, options = {}) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;
            
            this.target = options.target || 5000000;
            this.suffix = options.suffix || '+';
            this.updateInterval = options.updateInterval || 3000;
            
            this.init();
        }

        init() {
            this.render();
            this.startAnimation();
            this.startAutoUpdate();
        }

        render() {
            this.container.innerHTML = `
                <div class="user-stats-container">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <div class="stat-label">当前在线用户</div>
                        <div class="stat-number counter-animation" data-target="${this.target}">0</div>
                        <div class="stat-trend">
                            <span class="trend-up">↗</span>
                            <span>实时活跃</span>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .user-stats-container {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 30px;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                }
                .user-stats-container:hover {
                    border-color: var(--border-accent);
                    box-shadow: var(--shadow-lg);
                    transform: translateY(-5px);
                }
                .stat-icon {
                    font-size: 48px;
                }
                .stat-content {
                    flex: 1;
                }
                .stat-label {
                    font-size: 14px;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                }
                .stat-number {
                    font-size: 36px;
                    font-weight: bold;
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }
                .stat-trend {
                    font-size: 14px;
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .trend-up {
                    color: #00ff88;
                    font-size: 16px;
                }
            `;
            document.head.appendChild(style);
        }

        startAnimation() {
            const counterElement = this.container.querySelector('.counter-animation');
            if (counterElement) {
                const counter = new CounterAnimation(counterElement, {
                    target: this.target,
                    suffix: this.suffix,
                    duration: 2500
                });
                
                // 使用 Intersection Observer 触发动画
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            counter.animate();
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(this.container);
            }
        }

        startAutoUpdate() {
            setInterval(() => {
                const variation = Math.floor(Math.random() * 10000) - 5000;
                this.target = Math.max(5000000, this.target + variation);
                
                const counterElement = this.container.querySelector('.counter-animation');
                if (counterElement) {
                    counterElement.textContent = this.formatNumber(this.target) + this.suffix;
                }
            }, this.updateInterval);
        }

        formatNumber(num) {
            if (num >= 100000000) {
                return (num / 100000000).toFixed(2) + '亿';
            } else if (num >= 10000) {
                return (num / 10000).toFixed(2) + '万';
            }
            return num.toLocaleString('zh-CN');
        }
    }

    // 初始化函数
    function initDataVisualization() {
        // 初始化5G覆盖地图
        const mapContainer = document.getElementById('coverage-map');
        if (mapContainer) {
            new CoverageMap('coverage-map');
        }
        
        // 初始化网速测试
        const speedContainer = document.getElementById('speed-test');
        if (speedContainer) {
            new SpeedTest('speed-test');
        }
        
        // 初始化用户统计
        const userStatsContainer = document.getElementById('user-stats');
        if (userStatsContainer) {
            new UserStats('user-stats', {
                target: 5284321,
                suffix: '+',
                updateInterval: 5000
            });
        }
        
        // 初始化其他统计数字
        document.querySelectorAll('[data-counter]').forEach(el => {
            const target = parseInt(el.getAttribute('data-counter'));
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            
            const counter = new CounterAnimation(el, {
                target: target,
                suffix: suffix,
                prefix: prefix,
                duration: 2000
            });
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counter.animate();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(el);
        });
    }

    // 导出到全局
    window.DataVisualization = {
        CounterAnimation,
        CoverageMap,
        SpeedTest,
        UserStats,
        init: initDataVisualization
    };

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDataVisualization);
    } else {
        initDataVisualization();
    }
})();
