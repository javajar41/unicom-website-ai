/**
 * 中国联通官网 - 主题切换模块
 * 深色/浅色模式、记忆用户偏好
 */

(function() {
    'use strict';

    class ThemeSwitcher {
        constructor() {
            this.currentTheme = localStorage.getItem('unicom-theme') || 'dark';
            this.init();
        }

        init() {
            this.render();
            this.applyTheme(this.currentTheme);
            this.bindEvents();
        }

        render() {
            // 创建主题切换按钮
            const switcher = document.createElement('div');
            switcher.className = 'theme-switcher';
            switcher.innerHTML = `
                <button class="theme-btn ${this.currentTheme === 'light' ? '' : 'active'}" data-theme="dark" title="深色模式">
                    🌙
                </button>
                <button class="theme-btn ${this.currentTheme === 'light' ? 'active' : ''}" data-theme="light" title="浅色模式">
                    ☀️
                </button>
            `;
            document.body.appendChild(switcher);
        }

        bindEvents() {
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const theme = e.currentTarget.dataset.theme;
                    this.setTheme(theme);
                });
            });

            // 监听系统主题变化
            if (window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
                mediaQuery.addEventListener('change', (e) => {
                    // 仅在用户未手动设置时自动切换
                    if (!localStorage.getItem('unicom-theme')) {
                        this.setTheme(e.matches ? 'light' : 'dark');
                    }
                });
            }
        }

        setTheme(theme) {
            if (theme === this.currentTheme) return;
            
            this.currentTheme = theme;
            this.applyTheme(theme);
            localStorage.setItem('unicom-theme', theme);
            
            // 更新按钮状态
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === theme);
            });

            // 触发主题变化事件
            window.dispatchEvent(new CustomEvent('themechange', { 
                detail: { theme: theme }
            }));
        }

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            
            // 添加过渡效果
            document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
            
            // 更新 meta theme-color
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.content = theme === 'light' ? '#ffffff' : '#0a0e27';
            }
        }

        getCurrentTheme() {
            return this.currentTheme;
        }

        toggle() {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        }
    }

    // 初始化函数
    function initThemeSwitcher() {
        window.themeSwitcher = new ThemeSwitcher();
    }

    // 导出到全局
    window.ThemeSwitcher = {
        ThemeSwitcher,
        init: initThemeSwitcher
    };

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeSwitcher);
    } else {
        initThemeSwitcher();
    }
})();
