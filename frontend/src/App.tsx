import React from 'react'; 
// 导入 React 库，用于构建组件。
import Home from './pages/Home'; 
// 导入 Home 组件，用于在 App 组件中渲染。
import styles from './styles/App.module.css'; 
// 导入 CSS 模块，应用于组件的样式。

const App: React.FC = () => { 
  // 定义 App 组件，使用 React.FC 类型。
  return (
    <div className={styles.App}> 
      {/* 使用 CSS 模块中的 App 类名来应用样式。 */}
      <h1>Data Import and Management</h1> 
      {/* 显示标题 'Data Import and Management'。 */}
      <Home /> 
      {/* 渲染 Home 组件。 */}
    </div>
  );
}

export default App; 
// 导出 App 组件，以便在其他地方使用。