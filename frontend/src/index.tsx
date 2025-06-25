import React from 'react'; 
// 导入 React 库，用于构建组件。
import ReactDOM from 'react-dom'; 
// 导入 ReactDOM 库，用于将 React 组件渲染到 DOM 中。
import App from './App'; 
// 导入 App 组件，作为应用的根组件。
import './styles/App.module.css'; 
// 导入全局样式文件，应用于整个应用。

ReactDOM.render(
  <React.StrictMode> 
    {/* 使用 React.StrictMode 包裹应用，启用严格模式以帮助识别潜在问题。 */}
    <App /> 
    {/* 渲染 App 组件。 */}
  </React.StrictMode>,
  document.getElementById('root') 
  // 将组件渲染到具有 id 为 'root' 的 DOM 元素中。
);