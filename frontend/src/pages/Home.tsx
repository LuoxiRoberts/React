import React, { useEffect, useState } from 'react'; 
// 导入 React 库及其钩子 useEffect 和 useState，用于构建组件和管理状态。
import DataTable from '../components/DataTable'; 
// 导入 DataTable 组件，用于显示数据表格。
import SearchBar from '../components/SearchBar'; 
// 导入 SearchBar 组件，用于搜索功能。
import Pagination from '../components/Pagination'; 
// 导入 Pagination 组件，用于分页功能。
import axios from 'axios'; 
// 导入 axios 库，用于进行 HTTP 请求。
import { DataItem } from '../types'; 
// 导入 DataItem 类型，用于定义数据结构。

const Home: React.FC = () => { 
  // 定义 Home 组件，使用 React.FC 类型。
  const [data, setData] = useState<DataItem[]>([]); 
  // 使用 useState 钩子定义 data 状态，初始值为空数组。
  const [loading, setLoading] = useState<boolean>(true); 
  // 使用 useState 钩子定义 loading 状态，初始值为 true。
  const [currentPage, setCurrentPage] = useState<number>(1); 
  // 使用 useState 钩子定义 currentPage 状态，初始值为 1。
  const itemsPerPage = 10; 
  // 定义每页显示的项目数为 10。
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  // 使用 useState 钩子定义 searchTerm 状态，初始值为空字符串。
  const [total, setTotal] = useState<number>(0); 
  // 使用 useState 钩子定义 total 状态，初始值为 0。

  // 新增：省市县下拉
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]); 
  // 使用 useState 钩子定义 provinces 状态，初始值为空数组。
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]); 
  // 使用 useState 钩子定义 cities 状态，初始值为空数组。
  const [counties, setCounties] = useState<{ id: number; name: string }[]>([]); 
  // 使用 useState 钩子定义 counties 状态，初始值为空数组。
  const [provinceId, setProvinceId] = useState<number | ''>(''); 
  // 使用 useState 钩子定义 provinceId 状态，初始值为空字符串。
  const [cityId, setCityId] = useState<number | ''>(''); 
  // 使用 useState 钩子定义 cityId 状态，初始值为空字符串。
  const [countyId, setCountyId] = useState<number | ''>(''); 
  // 使用 useState 钩子定义 countyId 状态，初始值为空字符串。

  // 加载省份
  useEffect(() => { 
    // 使用 useEffect 钩子在组件挂载时执行。
    axios.get('/api/region/provinces').then(res => { 
      // 使用 axios 进行 GET 请求以获取省份数据。
      setProvinces(res.data || []); 
      // 更新 provinces 状态。
    });
  }, []); 
  // 依赖项为空数组，表示只在组件挂载时执行一次。

  // 选择省后加载市
  useEffect(() => { 
    // 使用 useEffect 钩子在 provinceId 变化时执行。
    if (provinceId) { 
      // 如果 provinceId 有值。
      axios.get('/api/region/cities', { params: { provinceId } }).then(res => { 
        // 使用 axios 进行 GET 请求以获取城市数据。
        setCities(res.data || []); 
        // 更新 cities 状态。
      });
      setCityId(''); 
      // 重置 cityId 状态。
      setCountyId(''); 
      // 重置 countyId 状态。
      setCounties([]); 
      // 重置 counties 状态。
    } else { 
      // 如果 provinceId 没有值。
      setCities([]); 
      // 清空 cities 状态。
      setCityId(''); 
      // 重置 cityId 状态。
      setCounties([]); 
      // 清空 counties 状态。
      setCountyId(''); 
      // 重置 countyId 状态。
    }
    setCurrentPage(1); 
    // 省份变化时，自动刷新数据，重置当前页为 1。
  }, [provinceId]); 
  // 依赖项为 provinceId，表示在 provinceId 变化时执行。

  // 选择市后加载县
  useEffect(() => { 
    // 使用 useEffect 钩子在 cityId 变化时执行。
    if (cityId) { 
      // 如果 cityId 有值。
      axios.get('/api/region/counties', { params: { cityId } }).then(res => { 
        // 使用 axios 进行 GET 请求以获取县数据。
        setCounties(res.data || []); 
        // 更新 counties 状态。
      });
      setCountyId(''); 
      // 重置 countyId 状态。
    } else { 
      // 如果 cityId 没有值。
      setCounties([]); 
      // 清空 counties 状态。
      setCountyId(''); 
      // 重置 countyId 状态。
    }
    setCurrentPage(1); 
    // 市变化时，自动刷新数据，重置当前页为 1。
  }, [cityId]); 
  // 依赖项为 cityId，表示在 cityId 变化时执行。

  // 选择县/区时刷新数据
  useEffect(() => { 
    // 使用 useEffect 钩子在 countyId 变化时执行。
    setCurrentPage(1); 
    // 重置当前页为 1。
  }, [countyId]); 
  // 依赖项为 countyId，表示在 countyId 变化时执行。

  useEffect(() => { 
    // 使用 useEffect 钩子在 searchTerm、currentPage、itemsPerPage、provinceId、cityId、countyId 变化时执行。
    const loadData = async () => { 
      // 定义异步函数 loadData。
      setLoading(true); 
      // 设置 loading 状态为 true。
      try {
        const response = await axios.get('/api/data', { 
          // 使用 axios 进行 GET 请求以获取数据。
          params: {
            page: currentPage, 
            // 当前页码。
            limit: itemsPerPage, 
            // 每页显示的项目数。
            search: searchTerm, 
            // 搜索关键词。
            provinceId: provinceId || undefined, 
            // 省份 ID。
            cityId: cityId || undefined, 
            // 城市 ID。
            countyId: countyId || undefined, 
            // 县 ID。
          },
        });
        setData(response.data.data); 
        // 更新 data 状态。
        setTotal(response.data.total); 
        // 更新 total 状态。
      } catch (err) {
        setData([]); 
        // 如果请求失败，清空 data 状态。
      } finally {
        setLoading(false); 
        // 请求完成后，无论成功与否，设置 loading 状态为 false。
      }
    };
    loadData(); 
    // 调用 loadData 函数。
  }, [searchTerm, currentPage, itemsPerPage, provinceId, cityId, countyId]); 
  // 依赖项为 searchTerm、currentPage、itemsPerPage、provinceId、cityId、countyId，表示在这些状态变化时执行。

  const handleSearch = (term: string) => { 
    // 定义 handleSearch 函数，接收一个字符串参数 term。
    setSearchTerm(term); 
    // 更新 searchTerm 状态。
    setCurrentPage(1); 
    // 重置当前页为 1。
  };

  const handlePageChange = (page: number) => { 
    // 定义 handlePageChange 函数，接收一个数字参数 page。
    setCurrentPage(page); 
    // 更新 currentPage 状态。
  };

  return (
    <div className="home"> 
      {/* 渲染 Home 组件的容器，使用类名 'home'。 */}
      <h1>Data Management</h1> 
      {/* 显示标题 'Data Management'。 */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
        {/* 使用内联样式设置布局和间距。 */}
        <label htmlFor="province-select" style={{ display: 'none' }}>选择省份</label> 
        {/* 隐藏的标签，用于无障碍访问。 */}
        <select
          id="province-select" 
          // 设置选择框的 ID。
          className="custom-select" 
          // 使用类名 'custom-select'。
          value={provinceId} 
          // 绑定选择框的值到 provinceId 状态。
          onChange={e => setProvinceId(e.target.value ? Number(e.target.value) : '')} 
          // 当选择框的值改变时，更新 provinceId 状态。
          title="选择省份" 
          // 设置选择框的标题。
        >
          <option value="">全部省份</option> 
          {/* 默认选项，表示选择全部省份。 */}
          {provinces.map(p => ( 
            // 遍历 provinces 数组，为每个省份创建一个选项。
            <option key={p.id} value={p.id}>{p.name}</option> 
            // 使用省份的 ID 作为选项的值，显示省份名称。
          ))}
        </select>
        <label htmlFor="city-select" style={{ display: 'none' }}>选择城市</label> 
        {/* 隐藏的标签，用于无障碍访问。 */}
        <select
          id="city-select" 
          // 设置选择框的 ID。
          className="custom-select" 
          // 使用类名 'custom-select'。
          value={cityId} 
          // 绑定选择框的值到 cityId 状态。
          onChange={e => setCityId(e.target.value ? Number(e.target.value) : '')} 
          // 当选择框的值改变时，更新 cityId 状态。
          disabled={!provinceId} 
          // 如果没有选择省份，禁用城市选择框。
          title="选择城市" 
          // 设置选择框的标题。
        >
          <option value="">全部城市</option> 
          {/* 默认选项，表示选择全部城市。 */}
          {cities.map(c => ( 
            // 遍历 cities 数组，为每个城市创建一个选项。
            <option key={c.id} value={c.id}>{c.name}</option> 
            // 使用城市的 ID 作为选项的值，显示城市名称。
          ))}
        </select>
        <label htmlFor="county-select" style={{ display: 'none' }}>选择区/县</label> 
        {/* 隐藏的标签，用于无障碍访问。 */}
        <select
          id="county-select" 
          // 设置选择框的 ID。
          className="custom-select" 
          // 使用类名 'custom-select'。
          value={countyId} 
          // 绑定选择框的值到 countyId 状态。
          onChange={e => setCountyId(e.target.value ? Number(e.target.value) : '')} 
          // 当选择框的值改变时，更新 countyId 状态。
          disabled={!cityId} 
          // 如果没有选择城市，禁用县选择框。
          title="选择区/县" 
          // 设置选择框的标题。
        >
          <option value="">全部区/县</option> 
          {/* 默认选项，表示选择全部区/县。 */}
          {counties.map(c => ( 
            // 遍历 counties 数组，为每个县创建一个选项。
            <option key={c.id} value={c.id}>{c.name}</option> 
            // 使用县的 ID 作为选项的值，显示县名称。
          ))}
        </select>
        <SearchBar onSearch={handleSearch} /> 
        {/* 渲染 SearchBar 组件，并传递 handleSearch 函数作为 onSearch 属性。 */}
      </div>
      {loading ? ( 
        // 如果 loading 状态为 true，显示加载提示。
        <p>Loading...</p> 
        // 显示加载提示文本。
      ) : (
        <> 
          {/* 使用 React Fragment 包裹多个子元素。 */}
          <DataTable data={data} /> 
          {/* 渲染 DataTable 组件，并传递 data 状态作为属性。 */}
          <Pagination
            totalItems={total} 
            // 传递 total 状态作为 totalItems 属性。
            itemsPerPage={itemsPerPage} 
            // 传递 itemsPerPage 作为 itemsPerPage 属性。
            currentPage={currentPage} 
            // 传递 currentPage 状态作为 currentPage 属性。
            onPageChange={handlePageChange} 
            // 传递 handlePageChange 函数作为 onPageChange 属性。
          />
        </>
      )}
    </div>
  );
};

export default Home; 
// 导出 Home 组件，以便在其他地方使用。