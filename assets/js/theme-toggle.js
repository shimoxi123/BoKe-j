// 主题切换功能
(function() {
  'use strict';
  
  // 主题状态管理
  const ThemeManager = {
    // 存储键名
    STORAGE_KEY: 'blog-theme-preference',
    
    // 主题类型
    THEMES: {
      LIGHT: 'light',
      DARK: 'dark'
    },
    
    // 初始化
    init() {
      this.createToggleButton();
      this.loadTheme();
      this.bindEvents();
    },
    
    // 创建切换按钮
    createToggleButton() {
      const button = document.createElement('button');
      button.className = 'theme-toggle';
      button.setAttribute('aria-label', '切换主题');
      button.setAttribute('title', '切换日间/夜间模式');
      
      // 添加图标
      button.innerHTML = `
        <svg class="theme-icon sun-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
        </svg>
        <svg class="theme-icon moon-icon" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
        </svg>
      `;
      
      document.body.appendChild(button);
      this.toggleButton = button;
    },
    
    // 绑定事件
    bindEvents() {
      if (this.toggleButton) {
        this.toggleButton.addEventListener('click', () => {
          this.toggleTheme();
        });
      }
      
      // 监听系统主题变化
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(() => {
          if (!this.hasUserPreference()) {
            this.applySystemTheme();
          }
        });
      }
    },
    
    // 获取当前主题
    getCurrentTheme() {
      return document.documentElement.getAttribute('data-theme') || this.THEMES.LIGHT;
    },
    
    // 获取系统主题偏好
    getSystemTheme() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return this.THEMES.DARK;
      }
      return this.THEMES.LIGHT;
    },
    
    // 检查是否有用户偏好设置
    hasUserPreference() {
      return localStorage.getItem(this.STORAGE_KEY) !== null;
    },
    
    // 获取存储的主题偏好
    getStoredTheme() {
      try {
        return localStorage.getItem(this.STORAGE_KEY);
      } catch (e) {
        console.warn('无法访问localStorage:', e);
        return null;
      }
    },
    
    // 存储主题偏好
    storeTheme(theme) {
      try {
        localStorage.setItem(this.STORAGE_KEY, theme);
      } catch (e) {
        console.warn('无法存储主题偏好:', e);
      }
    },
    
    // 应用主题
    applyTheme(theme) {
      const validTheme = theme === this.THEMES.DARK ? this.THEMES.DARK : this.THEMES.LIGHT;
      
      document.documentElement.setAttribute('data-theme', validTheme);
      this.updateToggleButton(validTheme);
      
      // 触发自定义事件
      const event = new CustomEvent('themeChanged', { 
        detail: { theme: validTheme } 
      });
      document.dispatchEvent(event);
    },
    
    // 应用系统主题
    applySystemTheme() {
      const systemTheme = this.getSystemTheme();
      this.applyTheme(systemTheme);
    },
    
    // 加载主题
    loadTheme() {
      const storedTheme = this.getStoredTheme();
      
      if (storedTheme) {
        this.applyTheme(storedTheme);
      } else {
        this.applySystemTheme();
      }
    },
    
    // 切换主题
    toggleTheme() {
      const currentTheme = this.getCurrentTheme();
      const newTheme = currentTheme === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
      
      this.applyTheme(newTheme);
      this.storeTheme(newTheme);
    },
    
    // 更新切换按钮
    updateToggleButton(theme) {
      if (!this.toggleButton) return;
      
      const sunIcon = this.toggleButton.querySelector('.sun-icon');
      const moonIcon = this.toggleButton.querySelector('.moon-icon');
      
      if (theme === this.THEMES.DARK) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        this.toggleButton.setAttribute('title', '切换到日间模式');
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        this.toggleButton.setAttribute('title', '切换到夜间模式');
      }
    }
  };
  
  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ThemeManager.init();
    });
  } else {
    ThemeManager.init();
  }
  
  // 导出到全局作用域（用于调试）
  window.ThemeManager = ThemeManager;
  
})();