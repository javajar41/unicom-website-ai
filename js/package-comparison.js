/**
 * 中国联通官网 - 套餐对比工具
 * 交互式滑块、自动推荐
 */

(function() {
    'use strict';

    // 套餐数据
    const packages = [
        {
            id: '5g-129',
            name: '5G畅享套餐',
            price: 129,
            data: 30,
            call: 500,
            features: ['5G优享服务', '100GB云存储', '视频会员'],
            recommended: false
        },
        {
            id: '5g-199',
            name: '5G尊享套餐',
            price: 199,
            data: 60,
            call: 1000,
            features: ['5G极速服务', '200GB云存储', '视频会员', '音乐会员'],
            recommended: true
        },
        {
            id: '5g-299',
            name: '5G至尊套餐',
            price: 299,
            data: 100,
            call: 2000,
            features: ['5G极速服务', '500GB云存储', '视频会员', '音乐会员', '国际漫游'],
            recommended: false
        },
        {
            id: '5g-599',
            name: '5G旗舰套餐',
            price: 599,
            data: 300,
            call: 5000,
            features: ['5G极速服务', '1TB云存储', '全平台会员', '专属客服', '国际漫游'],
            recommended: false
        }
    ];

    // 宽带套餐
    const broadbandPackages = [
        {
            id: 'bb-100',
            name: '智慧宽带 100M',
            price: 60,
            speed: '100M',
            features: ['免费安装', '基础路由器', '7×24服务'],
            recommended: false
        },
        {
            id: 'bb-300',
            name: '智慧宽带 300M',
            price: 80,
            speed: '300M',
            features: ['免费安装', '千兆路由器', 'IPTV基础版', '7×24服务'],
            recommended: true
        },
        {
            id: 'bb-500',
            name: '智慧宽带 500M',
            price: 120,
            speed: '500M',
            features: ['免费安装', '千兆路由器', 'IPTV尊享版', '云存储', '7×24服务'],
            recommended: false
        },
        {
            id: 'bb-1000',
            name: '智慧宽带 1000M',
            price: 199,
            speed: '1000M',
            features: ['免费安装', 'Mesh组网', 'IPTV尊享版', '云存储', '专属客服'],
            recommended: false
        }
    ];

    class PackageComparison {
        constructor(containerId, type = 'mobile') {
            this.container = document.getElementById(containerId);
            if (!this.container) return;
            
            this.type = type;
            this.packages = type === 'mobile' ? packages : broadbandPackages;
            this.userData = 20; // 用户流量需求(GB)
            this.userCall = 200; // 用户通话需求(分钟)
            this.recommendedPackage = null;
            
            this.init();
        }

        init() {
            this.render();
            this.bindEvents();
            this.updateRecommendation();
        }

        render() {
            this.container.innerHTML = `
                <div class="package-comparison-container">
                    <div class="package-finder">
                        <h3>💡 找到最适合你的${this.type === 'mobile' ? '套餐' : '宽带'}</h3>
                        ${this.type === 'mobile' ? `
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>月流量用量</span>
                                <span class="slider-value" id="data-value">20 GB</span>
                            </div>
                            <input type="range" class="package-slider" id="data-slider" 
                                min="5" max="200" value="20" step="5">
                        </div>
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>通话时长</span>
                                <span class="slider-value" id="call-value">200 分钟</span>
                            </div>
                            <input type="range" class="package-slider" id="call-slider" 
                                min="0" max="2000" value="200" step="50">
                        </div>
                        ` : `
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>家庭人数</span>
                                <span class="slider-value" id="people-value">3 人</span>
                            </div>
                            <input type="range" class="package-slider" id="people-slider" 
                                min="1" max="8" value="3" step="1">
                        </div>
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>使用场景</span>
                                <span class="slider-value" id="scene-value">日常</span>
                            </div>
                            <select class="scene-select" id="scene-select">
                                <option value="basic">日常浏览</option>
                                <option value="video">视频观看</option>
                                <option value="game">游戏电竞</option>
                                <option value="work">居家办公</option>
                            </select>
                        </div>
                        `}
                        <div class="recommendation-box" id="recommendation-box">
                            <div class="rec-badge">为你推荐</div>
                            <div class="rec-content" id="rec-content">
                                <!-- 动态内容 -->
                            </div>
                        </div>
                    </div>
                    <div class="package-cards" id="package-cards">
                        <!-- 动态生成套餐卡片 -->
                    </div>
                </div>
            `;
            
            this.renderPackageCards();
        }

        renderPackageCards() {
            const cardsContainer = document.getElementById('package-cards');
            if (!cardsContainer) return;
            
            cardsContainer.innerHTML = this.packages.map(pkg => `
                <div class="package-card ${pkg.recommended ? 'featured' : ''} ${pkg.id === this.recommendedPackage?.id ? 'recommended' : ''}" data-id="${pkg.id}">
                    ${pkg.recommended ? '<div class="popular-badge">热门</div>' : ''}
                    ${pkg.id === this.recommendedPackage?.id ? '<div class="rec-badge-top">推荐</div>' : ''}
                    <div class="package-header">
                        <h4>${pkg.name}</h4>
                        <div class="package-price">
                            <span class="price-symbol">¥</span>
                            <span class="price-number">${pkg.price}</span>
                            <span class="price-unit">/月</span>
                        </div>
                    </div>
                    <div class="package-features">
                        ${this.type === 'mobile' ? `
                        <div class="feature-highlight">
                            <span class="feature-value">${pkg.data}GB</span>
                            <span class="feature-label">全国流量</span>
                        </div>
                        <div class="feature-highlight">
                            <span class="feature-value">${pkg.call}分钟</span>
                            <span class="feature-label">语音通话</span>
                        </div>
                        ` : `
                        <div class="feature-highlight">
                            <span class="feature-value">${pkg.speed}</span>
                            <span class="feature-label">光纤速率</span>
                        </div>
                        `}
                        <ul class="feature-list">
                            ${pkg.features.map(f => `<li>✓ ${f}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="btn btn-primary package-btn">选择套餐</button>
                </div>
            `).join('');
        }

        bindEvents() {
            if (this.type === 'mobile') {
                const dataSlider = document.getElementById('data-slider');
                const callSlider = document.getElementById('call-slider');
                
                if (dataSlider) {
                    dataSlider.addEventListener('input', (e) => {
                        this.userData = parseInt(e.target.value);
                        document.getElementById('data-value').textContent = this.userData + ' GB';
                        this.updateRecommendation();
                    });
                }
                
                if (callSlider) {
                    callSlider.addEventListener('input', (e) => {
                        this.userCall = parseInt(e.target.value);
                        document.getElementById('call-value').textContent = this.userCall + ' 分钟';
                        this.updateRecommendation();
                    });
                }
            } else {
                const peopleSlider = document.getElementById('people-slider');
                const sceneSelect = document.getElementById('scene-select');
                
                if (peopleSlider) {
                    peopleSlider.addEventListener('input', (e) => {
                        const people = parseInt(e.target.value);
                        document.getElementById('people-value').textContent = people + ' 人';
                        this.userData = people;
                        this.updateRecommendation();
                    });
                }
                
                if (sceneSelect) {
                    sceneSelect.addEventListener('change', (e) => {
                        const scenes = {
                            'basic': '日常',
                            'video': '视频',
                            'game': '游戏',
                            'work': '办公'
                        };
                        document.getElementById('scene-value').textContent = scenes[e.target.value];
                        this.updateRecommendation();
                    });
                }
            }
            
            // 套餐卡片点击
            this.container.addEventListener('click', (e) => {
                if (e.target.classList.contains('package-btn')) {
                    const card = e.target.closest('.package-card');
                    const pkgId = card.dataset.id;
                    this.selectPackage(pkgId);
                }
            });
        }

        updateRecommendation() {
            // 计算推荐套餐
            if (this.type === 'mobile') {
                this.recommendedPackage = this.packages.find(pkg => 
                    pkg.data >= this.userData && pkg.call >= this.userCall
                ) || this.packages[this.packages.length - 1];
            } else {
                const sceneMultiplier = {
                    'basic': 1,
                    'video': 2,
                    'game': 3,
                    'work': 2
                };
                const sceneSelect = document.getElementById('scene-select');
                const multiplier = sceneMultiplier[sceneSelect?.value || 'basic'];
                const requiredSpeed = this.userData * multiplier * 50; // 粗略计算
                
                this.recommendedPackage = this.packages.find(pkg => {
                    const speed = parseInt(pkg.speed);
                    return speed >= requiredSpeed;
                }) || this.packages[this.packages.length - 1];
            }
            
            // 更新推荐显示
            const recContent = document.getElementById('rec-content');
            if (recContent && this.recommendedPackage) {
                recContent.innerHTML = `
                    <div class="rec-package">
                        <span class="rec-name">${this.recommendedPackage.name}</span>
                        <span class="rec-price">¥${this.recommendedPackage.price}/月</span>
                    </div>
                    <div class="rec-desc">
                        ${this.type === 'mobile' 
                            ? `包含 ${this.recommendedPackage.data}GB 流量 + ${this.recommendedPackage.call}分钟通话`
                            : `${this.recommendedPackage.speed} 光纤宽带`
                        }
                    </div>
                `;
            }
            
            // 更新卡片高亮
            this.renderPackageCards();
        }

        selectPackage(pkgId) {
            const pkg = this.packages.find(p => p.id === pkgId);
            if (!pkg) return;
            
            // 显示选择确认
            this.showToast(`已选择 ${pkg.name}，即将为您办理...`);
            
            // 高亮选中卡片
            this.container.querySelectorAll('.package-card').forEach(card => {
                card.classList.remove('selected');
                if (card.dataset.id === pkgId) {
                    card.classList.add('selected');
                }
            });
        }

        showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'package-toast';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-gradient);
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 14px;
                z-index: 10000;
                animation: slideUp 0.3s ease;
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideDown 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    // 初始化函数
    function initPackageComparison() {
        // 初始化移动套餐对比
        const mobileContainer = document.getElementById('package-comparison-mobile');
        if (mobileContainer) {
            new PackageComparison('package-comparison-mobile', 'mobile');
        }
        
        // 初始化宽带套餐对比
        const broadbandContainer = document.getElementById('package-comparison-broadband');
        if (broadbandContainer) {
            new PackageComparison('package-comparison-broadband', 'broadband');
        }
    }

    // 导出到全局
    window.PackageComparison = {
        PackageComparison,
        init: initPackageComparison
    };

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPackageComparison);
    } else {
        initPackageComparison();
    }
})();
