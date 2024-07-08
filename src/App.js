import React, { useState, useMemo } from 'react';
import customers from './customer';

function App() {
    const [data, setData] = useState(customers);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchInput, setSearchInput] = useState('');

    const sortedData = useMemo(() => {
        if (sortConfig.key) {
            const sorted = [...data].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            return sorted;
        }
        return data;
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        return Array.isArray(sortedData) ? sortedData.filter(customer => 
            Object.values(customer).some(val => 
                String(val).toLowerCase().includes(searchInput.toLowerCase())
            )
        ) : [];
    }, [sortedData, searchInput]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const renderArrow = (column) => {
        if (sortConfig.key === column) {
            return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
        }
        return '';
    };

    return (
        <div className='app'>
            <div className='search-container'>
                <input 
                    className='search-input'
                    value={searchInput}
                    onChange={handleSearch}
                    placeholder="Search"
                />
            </div>
            <table className='customer-table'>
                <thead>
                    <tr>
                        {['name', 'lastSeen', 'orders', 'totalAmount', 'latestPurchase', 'news', 'segments'].map(column => (
                            <th 
                                key={column}
                                onClick={() => requestSort(column)}
                                className='table-header'
                            >
                                {column}
                                {renderArrow(column)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((customer, index) => (
                        <tr key={index} className='table-row'>
                            <td>{customer.name}</td>
                            <td>{customer.lastSeen}</td>
                            <td>{customer.orders}</td>
                            <td>{customer.totalAmount}</td>
                            <td>{customer.latestPurchase}</td>
                            <td>{customer.news}</td>
                            <td>{customer.segments.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
                .app {
                    width: 150vh;
                    margin: 10px;
                    background-color: #f0f8ff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .search-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 5vh;
                }
                .search-input {
                    border-radius: 25px;
                    border: 2px solid #2c3e50;
                    background-color: #3498db;
                    padding-left: 10px;
                    color: white;
                    font-size: 16px;
                }
                .customer-table {
                    width: 100%;
                    margin-left: 5%;
                    border-collapse: collapse;
                }
                .table-header {
                    cursor: pointer;
                    padding: 10px;
                    background-color: #2980b9;
                    color: white;
                    text-align: center;
                    font-size: 18px;
                    border-bottom: 2px solid #2c3e50;
                }
                .table-header:hover {
                    background-color: #3498db;
                }
                .table-row {
                    text-align: center;
                    background-color: #ecf0f1;
                }
                .table-row:nth-child(even) {
                    background-color: #bdc3c7;
                }
                .table-row td {
                    padding: 10px;
                }
            `}</style>
        </div>
    );
}

export default App;
