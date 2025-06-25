import React from 'react'; // 导入 React 库，用于构建组件。
import styles from '../styles/App.module.css'; // 导入 CSS 模块，用于样式化组件。
interface PaginationProps { // 定义 PaginationProps 接口，表示组件的属性。
  currentPage: number; // 当前页码。
  itemsPerPage: number; // 每页显示的项目数。
  totalItems: number; // 项目的总数。
  onPageChange: (page: number) => void; // 页码改变时的回调函数。
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => { 
  // 定义 Pagination 组件，使用 React.FC 类型。
  const totalPages = Math.ceil(totalItems / itemsPerPage); 
  // 计算总页数，向上取整。

  const handleFirst = () => { // 定义处理跳转到第一页的函数。
    if (currentPage !== 1) { // 如果当前页不是第一页。
      onPageChange(1); // 调用 onPageChange 回调，跳转到第一页。
    }
  };

  const handlePrevious = () => { // 定义处理跳转到上一页的函数。
    if (currentPage > 1) { // 如果当前页大于第一页。
      onPageChange(currentPage - 1); // 调用 onPageChange 回调，跳转到上一页。
    }
  };

  const handleNext = () => { // 定义处理跳转到下一页的函数。
    if (currentPage < totalPages) { // 如果当前页小于总页数。
      onPageChange(currentPage + 1); // 调用 onPageChange 回调，跳转到下一页。
    }
  };

  const handleLast = () => { // 定义处理跳转到最后一页的函数。
    if (currentPage !== totalPages) { // 如果当前页不是最后一页。
      onPageChange(totalPages); // 调用 onPageChange 回调，跳转到最后一页。
    }
  };

  if (totalPages <= 1) return null; // 如果总页数小于等于 1，则不渲染分页组件。

  return (
    <div className={styles.pagination}>
      <button onClick={handleFirst} disabled={currentPage === 1}>
        第一页
      </button>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        上一页
      </button>
      <span>
        第 {currentPage} 页 / 共 {totalPages} 页
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        下一页
      </button>
      <button onClick={handleLast} disabled={currentPage === totalPages}>
        最后一页
      </button>
    </div>
  );
};

export default Pagination; // 导出 Pagination 组件，以便在其他地方使用。