import React, { useState } from 'react'; // 导入 React 库和 useState 钩子，用于构建组件和管理状态。
import styles from '../styles/App.module.css'; // 导入 CSS 模块，用于样式化组件。
interface SearchBarProps { // 定义 SearchBarProps 接口，表示组件的属性。
  onSearch: (query: string) => void; // onSearch 是一个回调函数，接收一个字符串参数。
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => { 
  // 定义 SearchBar 组件，使用 React.FC 类型。
  const [query, setQuery] = useState<string>(''); 


  const handleSearch = () => { // 定义 handleSearch 函数。
    onSearch(query); // 调用 onSearch 回调函数，将当前 query 传递给父组件。
  };

  return (
    <div className={styles.searchBar}> 
      {/* 渲染搜索栏的容器，使用类名 'search-bar'。 */}
      <input
        type="text" // 定义输入框的类型为文本。
        value={query} // 绑定输入框的值到 query 状态。
        onChange={(e) => setQuery(e.target.value)} 
        // 当输入框的值改变时，更新 query 状态。
        placeholder="Search..." 
        // 设置输入框的占位符文本。
      />
      <button onClick={handleSearch}>Search</button> 
      {/* 渲染搜索按钮，点击时调用 handleSearch 函数。 */}
    </div>
  );
};

export default SearchBar; // 导出 SearchBar 组件，以便在其他地方使用。