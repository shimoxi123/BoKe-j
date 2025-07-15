# 设计文档

## 概述

本设计文档描述了如何定制Jekyll博客以满足shimoxijimu的个人需求。设计重点是创建一个简洁高效的博客，具有现代化的用户体验功能，包括主题切换、代码复制功能和中文本地化支持。

## 架构

### 整体架构
- **基础框架**: Jekyll 4.4.1 静态站点生成器
- **主题策略**: 基于Minima主题进行定制化修改，而非完全替换
- **部署平台**: GitHub Pages 自动构建和部署
- **前端增强**: 原生JavaScript实现交互功能，无需额外框架

### 技术栈选择
- **Jekyll**: 保持现有版本4.4.1，确保GitHub Pages兼容性
- **主题基础**: Minima 2.5作为基础，通过覆盖和扩展实现定制
- **样式系统**: SCSS/CSS，利用CSS自定义属性实现主题切换
- **JavaScript**: 原生ES6+，实现代码复制和主题切换功能
- **字体**: 系统字体栈，优化中文显示

## 组件和接口

### 1. 配置组件
**文件**: `_config.yml`
- 更新站点基本信息（标题、邮箱、描述）
- 配置GitHub用户名和仓库信息
- 设置中文语言声明
- 保持现有插件配置

### 2. 主题定制组件
**文件结构**:
```
_sass/
  custom/
    _variables.scss     # 自定义变量和颜色方案
    _theme-toggle.scss  # 主题切换样式
    _code-copy.scss     # 代码复制按钮样式
    _typography.scss    # 中文字体优化
_includes/
  theme-toggle.html     # 主题切换按钮组件
  code-copy.html        # 代码复制功能组件
  head-custom.html      # 自定义头部内容
assets/
  js/
    theme-toggle.js     # 主题切换逻辑
    code-copy.js        # 代码复制逻辑
```
### 3. 
页面组件
**关于页面**: `about.markdown`
- 替换默认内容为个人信息
- 包含联系邮箱信息
- 保持简洁专业的格式

### 4. 布局增强组件
**主题切换按钮**:
- 位置: 页面右上角
- 状态: 日间/夜间模式切换
- 持久化: localStorage存储用户偏好

**代码复制功能**:
- 自动检测代码块
- 添加复制按钮
- 提供视觉反馈

## 数据模型

### 主题状态模型
```javascript
ThemeState = {
  current: 'light' | 'dark',
  preference: 'light' | 'dark' | 'auto',
  systemPreference: 'light' | 'dark'
}
```

### 站点配置模型
```yaml
SiteConfig = {
  title: "shimoxijimu的个人博客",
  email: "boke.shimoxi.dpdns.org",
  description: "个人技术博客，分享编程经验和技术见解",
  github_username: "shimoxi123",
  lang: "zh-CN"
}
```

## 错误处理

### JavaScript功能降级
- **主题切换**: 如果JavaScript禁用，默认使用浅色主题
- **代码复制**: 如果Clipboard API不支持，隐藏复制按钮
- **本地存储**: 如果localStorage不可用，每次访问重置为默认主题

### 浏览器兼容性
- **CSS自定义属性**: 提供fallback值
- **ES6功能**: 使用兼容性良好的语法
- **移动端适配**: 确保触摸友好的交互

### 构建错误处理
- **SCSS编译**: 提供清晰的错误信息
- **Jekyll构建**: 确保所有依赖正确配置
- **GitHub Pages**: 使用支持的插件和配置#
# 测试策略

### 功能测试
1. **主题切换测试**
   - 验证按钮点击切换功能
   - 验证偏好设置持久化
   - 验证系统主题检测

2. **代码复制测试**
   - 验证复制按钮显示
   - 验证复制功能正确性
   - 验证反馈提示显示

3. **响应式测试**
   - 桌面端布局验证
   - 移动端布局验证
   - 不同屏幕尺寸适配

### 性能测试
- **页面加载速度**: 确保额外功能不影响加载性能
- **JavaScript执行**: 优化脚本执行效率
- **CSS大小**: 控制样式文件大小

### 兼容性测试
- **浏览器兼容**: Chrome, Firefox, Safari, Edge
- **移动端兼容**: iOS Safari, Android Chrome
- **辅助功能**: 屏幕阅读器兼容性

## 实现细节

### 主题切换实现
```scss
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --accent-color: #0066cc;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #e0e0e0;
  --accent-color: #4da6ff;
}
```

### 代码复制实现
- 使用Clipboard API进行复制操作
- 动态添加复制按钮到代码块
- 提供复制成功的视觉反馈

### 中文优化
- 设置合适的中文字体栈
- 优化行高和字间距
- 确保中英文混排的可读性

## 部署配置

### GitHub Pages设置
- 启用GitHub Pages从main分支构建
- 配置自定义域名（如需要）
- 确保Jekyll配置与GitHub Pages兼容

### 构建优化
- 压缩CSS和JavaScript
- 优化图片资源
- 启用缓存策略