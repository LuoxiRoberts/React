
import React from 'react'; // 导入 React 库，用于构建组件。
import styles from '../styles/App.module.css'; // 导入 CSS 模块，用于样式化组件。
import { DataItem } from '../types'; // 导入 DataItem 类型，用于定义数据结构。

interface DataTableProps { // 定义 DataTableProps 接口，表示组件的属性。
  data: DataItem[]; // data 属性是一个 DataItem 类型的数组。
}

const formatDate = (date: string | Date) => { // 定义 formatDate 函数，用于格式化日期。
  if (!date) return ''; // 如果日期为空，返回空字符串。
  const d = typeof date === 'string' ? new Date(date) : date; // 如果日期是字符串，转换为 Date 对象。
  return d.toLocaleString(); // 返回本地化的日期字符串。
};

const DataTable: React.FC<DataTableProps> = ({ data }) => { // 定义 DataTable 组件，使用 React.FC 类型。
  return (
    <table className={styles['data-table']}> 
      <thead>
        <tr>
          <th>ID</th>
          <th>项目名称</th>
          <th>创建时间</th>
          <th>更新时间</th> 
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? ( // 如果数据为空，显示“暂无数据”。
          <tr>
            <td colSpan={4} className={styles['no-data']}>暂无数据</td> 
          </tr>
        ) : (
          data.map(item => ( // 遍历数据数组，为每个数据项创建一行。
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.projectName}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>{formatDate(item.updatedAt)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default DataTable; // 导出 DataTable 组件，以便在其他地方使用。