/**
 * 中国联通官网 - 多语言支持模块
 * 中英文切换功能
 */

(function() {
    'use strict';

    // 翻译数据
    const translations = {
        'zh': {
            // 导航
            'nav_home': '首页',
            'nav_products': '产品服务',
            'nav_5g': '5G专区',
            'nav_business': '政企客户',
            'nav_support': '服务支持',
            'nav_login': '登录',
            'nav_register': '注册',
            
            // Hero区域
            'hero_badge': '🚀 5G新时代',
            'hero_title_1': '创新，',
            'hero_title_2': '改变世界',
            'hero_desc': '中国联通5G，让未来触手可及。超高速率、超低时延、海量连接，开启智能新生活。',
            'hero_btn_primary': '立即办理',
            'hero_btn_secondary': '了解更多',
            
            // 数据展示
            'data_title': '实时数据',
            'data_coverage': '5G覆盖地图',
            'data_online_users': '当前在线用户',
            'data_speed_test': '网速测试',
            'data_coverage_desc': '覆盖全国34个省级行政区',
            'data_start_test': '开始测速',
            'data_download': '下载',
            'data_upload': '上传',
            'data_ping': '延迟',
            
            // 套餐对比
            'package_title': '套餐对比',
            'package_subtitle': '找到最适合你的套餐',
            'package_data': '月流量用量',
            'package_call': '通话时长',
            'package_recommend': '为你推荐',
            'package_select': '选择套餐',
            'package_featured': '热门',
            'package_data_unit': 'GB',
            'package_call_unit': '分钟',
            
            // 宽带
            'broadband_title': '智慧宽带',
            'broadband_people': '家庭人数',
            'broadband_scene': '使用场景',
            'broadband_scene_basic': '日常浏览',
            'broadband_scene_video': '视频观看',
            'broadband_scene_game': '游戏电竞',
            'broadband_scene_work': '居家办公',
            'broadband_speed': '光纤速率',
            
            // 产品展示
            'products_title': '热门产品',
            'products_subtitle': '为您提供全方位的通信服务解决方案',
            'product_5g': '5G套餐',
            'product_5g_desc': '超大流量、超快网速，畅享5G新生活。多种档位可选，满足不同需求。',
            'product_broadband': '智慧宽带',
            'product_broadband_desc': '千兆光纤入户，全屋智能覆盖。游戏、4K视频、远程办公零卡顿。',
            'product_iot': '物联网',
            'product_iot_desc': '万物互联，智享未来。为企业提供专业的物联网连接服务。',
            'product_detail': '查看详情',
            
            // 特色服务
            'features_title': '便捷服务',
            'features_subtitle': '随时随地，轻松办理',
            'feature_online': '在线办理',
            'feature_online_desc': '足不出户，业务轻松办理',
            'feature_service': '智能客服',
            'feature_service_desc': '24小时在线，快速响应',
            'feature_app': 'APP下载',
            'feature_app_desc': '掌上一站式服务',
            'feature_store': '营业厅查询',
            'feature_store_desc': '附近网点，一键导航',
            
            // 页脚
            'footer_brand': '中国联通',
            'footer_slogan': '创新·改变世界',
            'footer_slogan_2': '让一切自由联通',
            'footer_products': '产品服务',
            'footer_personal': '个人业务',
            'footer_family': '家庭业务',
            'footer_enterprise': '政企客户',
            'footer_selfservice': '自助服务',
            'footer_query': '话费查询',
            'footer_handle': '业务办理',
            'footer_online': '在线客服',
            'footer_about': '关于我们',
            'footer_company': '公司简介',
            'footer_news': '新闻中心',
            'footer_join': '加入我们',
            'footer_copyright': '© 2024 中国联通 版权所有',
            
            // 客服
            'chat_title': '联通智能客服',
            'chat_online': '在线',
            'chat_placeholder': '输入您的问题...',
            'chat_welcome': '您好！我是联通智能客服，请问有什么可以帮助您？',
            'chat_package': '套餐咨询',
            'chat_broadband': '宽带办理',
            'chat_5g': '5G覆盖',
            'chat_contact': '联系客服'
        },
        'en': {
            // Navigation
            'nav_home': 'Home',
            'nav_products': 'Products',
            'nav_5g': '5G Zone',
            'nav_business': 'Business',
            'nav_support': 'Support',
            'nav_login': 'Login',
            'nav_register': 'Register',
            
            // Hero
            'hero_badge': '🚀 5G New Era',
            'hero_title_1': 'Innovation',
            'hero_title_2': 'Changes the World',
            'hero_desc': 'China Unicom 5G makes the future within reach. Ultra-fast speed, ultra-low latency, massive connections - start your smart new life.',
            'hero_btn_primary': 'Get Started',
            'hero_btn_secondary': 'Learn More',
            
            // Data
            'data_title': 'Live Data',
            'data_coverage': '5G Coverage Map',
            'data_online_users': 'Online Users',
            'data_speed_test': 'Speed Test',
            'data_coverage_desc': 'Covering 34 provincial-level regions',
            'data_start_test': 'Start Test',
            'data_download': 'Download',
            'data_upload': 'Upload',
            'data_ping': 'Ping',
            
            // Packages
            'package_title': 'Plans Comparison',
            'package_subtitle': 'Find the best plan for you',
            'package_data': 'Monthly Data',
            'package_call': 'Call Minutes',
            'package_recommend': 'Recommended',
            'package_select': 'Select Plan',
            'package_featured': 'Popular',
            'package_data_unit': 'GB',
            'package_call_unit': 'min',
            
            // Broadband
            'broadband_title': 'Smart Broadband',
            'broadband_people': 'Household Size',
            'broadband_scene': 'Usage',
            'broadband_scene_basic': 'Basic',
            'broadband_scene_video': 'Video',
            'broadband_scene_game': 'Gaming',
            'broadband_scene_work': 'Work',
            'broadband_speed': 'Fiber Speed',
            
            // Products
            'products_title': 'Popular Products',
            'products_subtitle': 'Comprehensive communication solutions for you',
            'product_5g': '5G Plans',
            'product_5g_desc': 'Massive data, ultra-fast speed. Enjoy your new 5G life with multiple options.',
            'product_broadband': 'Smart Broadband',
            'product_broadband_desc': 'Gigabit fiber to the home. Zero lag for gaming, 4K video, and remote work.',
            'product_iot': 'IoT',
            'product_iot_desc': 'Connect everything, enjoy the future. Professional IoT services for enterprises.',
            'product_detail': 'Learn More',
            
            // Features
            'features_title': 'Convenient Services',
            'features_subtitle': 'Easy to use, anywhere, anytime',
            'feature_online': 'Online Service',
            'feature_online_desc': 'Handle business from home',
            'feature_service': 'Smart Customer Service',
            'feature_service_desc': '24/7 online, quick response',
            'feature_app': 'Download App',
            'feature_app_desc': 'One-stop mobile service',
            'feature_store': 'Store Locator',
            'feature_store_desc': 'Find nearby locations',
            
            // Footer
            'footer_brand': 'China Unicom',
            'footer_slogan': 'Innovation Changes',
            'footer_slogan_2': 'the World',
            'footer_products': 'Products',
            'footer_personal': 'Personal',
            'footer_family': 'Family',
            'footer_enterprise': 'Enterprise',
            'footer_selfservice': 'Self-Service',
            'footer_query': 'Balance Query',
            'footer_handle': 'Services',
            'footer_online': 'Support',
            'footer_about': 'About Us',
            'footer_company': 'Company',
            'footer_news': 'News',
            'footer_join': 'Careers',
            'footer_copyright': '© 2024 China Unicom. All rights reserved.',
            
            // Chat
            'chat_title': 'Smart Customer Service',
            'chat_online': 'Online',
            'chat_placeholder': 'Type your question...',
            'chat_welcome': 'Hello! I am Unicom Smart Service. How can I help you?',
            'chat_package': 'Plans',
            'chat_broadband': 'Broadband',
            'chat_5g': '5G Coverage',
            'chat_contact': 'Contact Us'
        }
    };

    class I18n {
        constructor() {
            this.currentLang = localStorage.getItem('unicom-lang') || 'zh';
            this.init();
        }

        init() {
            this.render();
            this.applyLanguage(this.currentLang);
            this.bindEvents();
        }

        render() {
            // 创建语言切换按钮
            const switcher = document.createElement('div');
            switcher.className = 'lang-switcher';
            switcher.innerHTML = `
                <button class="lang-btn ${this.currentLang === 'zh' ? 'active' : ''}" data-lang="zh" title="中文">
                    中
                </button>
                <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English">
                    EN
                </button>
            `;
            document.body.appendChild(switcher);
        }

        bindEvents() {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = e.currentTarget.dataset.lang;
                    this.setLanguage(lang);
                });
            });
        }

        setLanguage(lang) {
            if (lang === this.currentLang) return;
            
            this.currentLang = lang;
            this.applyLanguage(lang);
            localStorage.setItem('unicom-lang', lang);
            
            // 更新按钮状态
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            // 触发语言变化事件
            window.dispatchEvent(new CustomEvent('languagechange', { 
                detail: { lang: lang }
            }));
        }

        applyLanguage(lang) {
            const t = translations[lang];
            if (!t) return;

            // 更新所有带有 data-i18n 属性的元素
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (t[key]) {
                    if (el.tagName === 'INPUT' && el.placeholder) {
                        el.placeholder = t[key];
                    } else {
                        el.textContent = t[key];
                    }
                }
            });

            // 更新 HTML lang 属性
            document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        }

        getText(key) {
            return translations[this.currentLang]?.[key] || translations['zh']?.[key] || key;
        }

        getCurrentLang() {
            return this.currentLang;
        }
    }

    // 初始化函数
    function initI18n() {
        window.i18n = new I18n();
    }

    // 导出到全局
    window.I18n = {
        I18n,
        translations,
        init: initI18n
    };

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
})();
