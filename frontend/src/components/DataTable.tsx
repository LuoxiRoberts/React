import React from 'react';
import styles from '../styles/App.module.css';
import { DataItem } from '../types';

interface DataTableProps {
  data: DataItem[];
}

const formatDate = (date: string | Date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
};

const DataTable: React.FC<DataTableProps> = ({ data }) => {
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
        {data.length === 0 ? (
          <tr>
            <td colSpan={4} className={styles['no-data']}>暂无数据</td>
          </tr>
        ) : (
          data.map(item => (
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

export default DataTable;