// 代码复制功能
(function() {
  'use strict';
  
  // 代码复制管理器
  const CodeCopyManager = {
    // 初始化
    init() {
      this.setupCodeBlocks();
      this.bindEvents();
    },
    
    // 设置代码块
    setupCodeBlocks() {
      // 查找所有代码块
      const codeBlocks = document.querySelectorAll('pre code, .highlight pre');
      
      codeBlocks.forEach((codeBlock, index) => {
        this.wrapCodeBlock(codeBlock, index);
      });
    },
    
    // 包装代码块
    wrapCodeBlock(codeBlock, index) {
      const pre = codeBlock.tagName === 'PRE' ? codeBlock : codeBlock.parentElement;
      
      // 如果已经被包装过，跳过
      if (pre.parentElement.classList.contains('code-block-wrapper')) {
        return;
      }
      
      // 创建包装器
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      wrapper.setAttribute('data-code-block', index);
      
      // 创建复制按钮
      const copyButton = this.createCopyButton(index);
      
      // 包装代码块
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(copyButton);
    },
    
    // 创建复制按钮
    createCopyButton(index) {
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.setAttribute('data-code-index', index);
      button.setAttribute('aria-label', '复制代码');
      button.setAttribute('title', '复制代码到剪贴板');
      
      button.innerHTML = `
        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        <span class="copy-text">复制</span>
      `;
      
      return button;
    },
    
    // 绑定事件
    bindEvents() {
      document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-button')) {
          const button = e.target.closest('.copy-button');
          const codeIndex = button.getAttribute('data-code-index');
          this.copyCode(button, codeIndex);
        }
      });
    },
    
    // 复制代码
    async copyCode(button, codeIndex) {
      const wrapper = document.querySelector(`[data-code-block="${codeIndex}"]`);
      if (!wrapper) return;
      
      const codeElement = wrapper.querySelector('pre code, pre');
      if (!codeElement) return;
      
      const codeText = this.getCodeText(codeElement);
      
      try {
        await this.copyToClipboard(codeText);
        this.showCopySuccess(button);
      } catch (error) {
        console.warn('复制失败:', error);
        this.showCopyError(button);
      }
    },
    
    // 获取代码文本
    getCodeText(element) {
      // 如果是 code 元素，直接获取文本
      if (element.tagName === 'CODE') {
        return element.textContent || element.innerText;
      }
      
      // 如果是 pre 元素，查找其中的 code 元素
      const codeElement = element.querySelector('code');
      if (codeElement) {
        return codeElement.textContent || codeElement.innerText;
      }
      
      // 否则直接获取 pre 的文本内容
      return element.textContent || element.innerText;
    },
    
    // 复制到剪贴板
    async copyToClipboard(text) {
      // 优先使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }
      
      // 降级到传统方法
      return this.fallbackCopyToClipboard(text);
    },
    
    // 降级复制方法
    fallbackCopyToClipboard(text) {
      return new Promise((resolve, reject) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        try {
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (successful) {
            resolve();
          } else {
            reject(new Error('execCommand failed'));
          }
        } catch (err) {
          document.body.removeChild(textArea);
          reject(err);
        }
      });
    },
    
    // 显示复制成功
    showCopySuccess(button) {
      const originalText = button.querySelector('.copy-text');
      const originalTitle = button.getAttribute('title');
      
      // 更新按钮状态
      button.classList.add('copied');
      if (originalText) {
        originalText.textContent = '已复制';
      }
      button.setAttribute('title', '代码已复制到剪贴板');
      
      // 显示反馈提示
      this.showFeedback(button, '复制成功！');
      
      // 2秒后恢复原状
      setTimeout(() => {
        button.classList.remove('copied');
        if (originalText) {
          originalText.textContent = '复制';
        }
        button.setAttribute('title', originalTitle);
      }, 2000);
    },
    
    // 显示复制错误
    showCopyError(button) {
      this.showFeedback(button, '复制失败');
      
      // 1秒后隐藏
      setTimeout(() => {
        const feedback = button.parentElement.querySelector('.copy-feedback');
        if (feedback) {
          feedback.remove();
        }
      }, 1000);
    },
    
    // 显示反馈提示
    showFeedback(button, message) {
      // 移除已存在的反馈
      const existingFeedback = button.parentElement.querySelector('.copy-feedback');
      if (existingFeedback) {
        existingFeedback.remove();
      }
      
      // 创建新的反馈提示
      const feedback = document.createElement('div');
      feedback.className = 'copy-feedback';
      feedback.textContent = message;
      
      button.parentElement.appendChild(feedback);
      
      // 触发显示动画
      setTimeout(() => {
        feedback.classList.add('show');
      }, 10);
      
      // 3秒后自动隐藏
      setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
          if (feedback.parentElement) {
            feedback.remove();
          }
        }, 300);
      }, 3000);
    }
  };
  
  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      CodeCopyManager.init();
    });
  } else {
    CodeCopyManager.init();
  }
  
  // 导出到全局作用域（用于调试）
  window.CodeCopyManager = CodeCopyManager;
  
})();