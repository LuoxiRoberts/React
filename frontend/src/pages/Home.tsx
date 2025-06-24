import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import axios from 'axios';
import { DataItem } from '../types';

const Home: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  // 新增：省市县下拉
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [counties, setCounties] = useState<{ id: number; name: string }[]>([]);
  const [provinceId, setProvinceId] = useState<number | ''>('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [countyId, setCountyId] = useState<number | ''>('');

  // 加载省份
  useEffect(() => {
    axios.get('/api/region/provinces').then(res => {
      setProvinces(res.data || []);
    });
  }, []);

  // 选择省后加载市
  useEffect(() => {
    if (provinceId) {
      axios.get('/api/region/cities', { params: { provinceId } }).then(res => {
        setCities(res.data || []);
      });
      setCityId('');
      setCountyId('');
      setCounties([]);
    } else {
      setCities([]);
      setCityId('');
      setCounties([]);
      setCountyId('');
    }
    // 省份变化时，自动刷新数据
    setCurrentPage(1);
  }, [provinceId]);

  // 选择市后加载县
  useEffect(() => {
    if (cityId) {
      axios.get('/api/region/counties', { params: { cityId } }).then(res => {
        setCounties(res.data || []);
      });
      setCountyId('');
    } else {
      setCounties([]);
      setCountyId('');
    }
    // 市变化时，自动刷新数据
    setCurrentPage(1);
  }, [cityId]);

  // 选择县/区时刷新数据
  useEffect(() => {
    setCurrentPage(1);
  }, [countyId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/data', {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            provinceId: provinceId || undefined,
            cityId: cityId || undefined,
            countyId: countyId || undefined,
          },
        });
        setData(response.data.data);
        setTotal(response.data.total);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchTerm, currentPage, itemsPerPage, provinceId, cityId, countyId]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="home">
      <h1>Data Management</h1>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
        <label htmlFor="province-select" style={{ display: 'none' }}>选择省份</label>
        <select
          id="province-select"
          className="custom-select"
          value={provinceId}
          onChange={e => setProvinceId(e.target.value ? Number(e.target.value) : '')}
          title="选择省份"
        >
          <option value="">全部省份</option>
          {provinces.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <label htmlFor="city-select" style={{ display: 'none' }}>选择城市</label>
        <select
          id="city-select"
          className="custom-select"
          value={cityId}
          onChange={e => setCityId(e.target.value ? Number(e.target.value) : '')}
          disabled={!provinceId}
          title="选择城市"
        >
          <option value="">全部城市</option>
          {cities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label htmlFor="county-select" style={{ display: 'none' }}>选择区/县</label>
        <select
          id="county-select"
          className="custom-select"
          value={countyId}
          onChange={e => setCountyId(e.target.value ? Number(e.target.value) : '')}
          disabled={!cityId}
          title="选择区/县"
        >
          <option value="">全部区/县</option>
          {counties.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <SearchBar onSearch={handleSearch} />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DataTable data={data} />
          <Pagination
            totalItems={total}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Home;