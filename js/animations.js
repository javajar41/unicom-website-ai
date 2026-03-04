/**
 * 中国联通官网 - 滚动动画模块
 * Intersection Observer 监听滚动，触发淡入/滑动效果
 */

(function() {
    'use strict';

    class ScrollAnimations {
        constructor() {
            this.observerOptions = {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            };
            this.init();
        }

        init() {
            this.setupObserver();
            this.setupScrollAnimations();
            this.setupParallaxEffects();
        }

        setupObserver() {
            // 创建 Intersection Observer
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // 添加可见类触发动画
                        entry.target.classList.add('visible');
                        
                        // 触发自定义事件
                        entry.target.dispatchEvent(new CustomEvent('scroll-into-view'));
                        
                        // 如果设置了只触发一次，取消观察
                        if (entry.target.dataset.animateOnce !== 'false') {
                            this.observer.unobserve(entry.target);
                        }
                    }
                });
            }, this.observerOptions);

            // 观察所有需要动画的元素
            document.querySelectorAll('[data-animate], .animate-on-scroll').forEach(el => {
                this.observer.observe(el);
            });
        }

        setupScrollAnimations() {
            // 为不同元素添加动画类
            const animationConfigs = [
                { selector: '.section-title', animation: 'fade-up', delay: 0 },
                { selector: '.product-card', animation: 'fade-up', stagger: 100 },
                { selector: '.feature-item', animation: 'scale-in', stagger: 100 },
                { selector: '.stat-card', animation: 'slide-in-left', stagger: 150 },
                { selector: '.package-card', animation: 'fade-up', stagger: 100 },
                { selector: '.data-viz-item', animation: 'slide-in-right', stagger: 150 },
                { selector: '.footer-links', animation: 'fade-up', stagger: 100 }
            ];

            animationConfigs.forEach(config => {
                const elements = document.querySelectorAll(config.selector);
                elements.forEach((el, index) => {
                    el.classList.add('animate-on-scroll', config.animation);
                    if (config.stagger) {
                        el.style.transitionDelay = `${index * config.stagger}ms`;
                    }
                    this.observer.observe(el);
                });
            });
        }

        setupParallaxEffects() {
            // 视差滚动效果
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            if (parallaxElements.length === 0) return;

            let ticking = false;
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateParallax(parallaxElements);
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }

        updateParallax(elements) {
            const scrollY = window.pageYOffset;
            
            elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const offset = (scrollY - elementTop) * speed;
                
                el.style.transform = `translateY(${offset}px)`;
            });
        }

        // 手动触发元素动画
        animateElement(element) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            if (element) {
                element.classList.add('visible');
            }
        }

        // 重置元素动画
        resetElement(element) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            if (element) {
                element.classList.remove('visible');
                this.observer.observe(element);
            }
        }
    }

    // Hero区域特殊动画
    class HeroAnimations {
        constructor() {
            this.init();
        }

        init() {
            this.animateHeroText();
            this.animateHeroBadge();
            this.createParticles();
        }

        animateHeroText() {
            const heroTitle = document.querySelector('.hero h1');
            if (!heroTitle) return;

            // 逐字显示效果
            const text = heroTitle.innerHTML;
            heroTitle.innerHTML = '';
            
            // 保留换行
            const lines = text.split('<br>');
            lines.forEach((line, lineIndex) => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'hero-line';
                
                const chars = line.split('');
                chars.forEach((char, charIndex) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'hero-char';
                    span.style.animationDelay = `${(lineIndex * chars.length + charIndex) * 0.05}s`;
                    lineDiv.appendChild(span);
                });
                
                heroTitle.appendChild(lineDiv);
                if (lineIndex < lines.length - 1) {
                    heroTitle.appendChild(document.createElement('br'));
                }
            });

            // 添加动画样式
            const style = document.createElement('style');
            style.textContent = `
                .hero-char {
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: heroCharIn 0.5s ease forwards;
                }
                @keyframes heroCharIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        animateHeroBadge() {
            const badge = document.querySelector('.hero-badge');
            if (!badge) return;

            badge.style.opacity = '0';
            badge.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                badge.style.transition = 'all 0.6s ease';
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, 500);
        }

        createParticles() {
            const hero = document.querySelector('.hero');
            if (!hero) return;

            // 创建粒子效果容器
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'hero-particles';
            hero.appendChild(particlesContainer);

            // 添加粒子
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'hero-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2});
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                particlesContainer.appendChild(particle);
            }

            // 添加粒子样式
            const style = document.createElement('style');
            style.textContent = `
                .hero-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 0;
                }
                .hero-particle {
                    will-change: transform;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 计数器动画
    class CounterAnimation {
        constructor(element, target, duration = 2000) {
            this.element = element;
            this.target = target;
            this.duration = duration;
            this.isAnimating = false;
        }

        start() {
            if (this.isAnimating) return;
            this.isAnimating = true;

            const startTime = performance.now();
            const startValue = 0;

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.duration, 1);
                
                // 缓动函数
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (this.target - startValue) * easeOutQuart);
                
                this.element.textContent = this.formatNumber(currentValue);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isAnimating = false;
                }
            };

            requestAnimationFrame(animate);
        }

        formatNumber(num) {
            return num.toLocaleString('zh-CN');
        }
    }

    // 初始化函数
    function initAnimations() {
        // 延迟初始化，确保DOM完全加载
        setTimeout(() => {
            window.scrollAnimations = new ScrollAnimations();
            window.heroAnimations = new HeroAnimations();
            
            // 初始化计数器动画
            document.querySelectorAll('[data-counter]').forEach(el => {
                const target = parseInt(el.dataset.counter);
                const duration = parseInt(el.dataset.duration) || 2000;
                
                const counter = new CounterAnimation(el, target, duration);
                
                // 当元素进入视口时触发
                el.addEventListener('scroll-into-view', () => {
                    counter.start();
                });
            });
        }, 100);
    }

    // 导出到全局
    window.Animations = {
        ScrollAnimations,
        HeroAnimations,
        CounterAnimation,
        init: initAnimations
    };

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
