import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function CveList() {
  const [cves, setCves] = useState([]);
  const [id, setId] = useState('');
  const [year, setYear] = useState('');
  const [score, setScore] = useState('');
  const [lastModifiedDays, setLastModifiedDays] = useState('');
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(20); // Items per page
  const [total, setTotal] = useState(0); // Total number of items
  const [pages, setPages] = useState(0); // Total number of pages
  const [loading, setLoading] = useState(false);

  // Function to fetch data
  const fetchData = async (params = {}) => {
    console.log('Fetching data...');
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/cves', { params });
      console.log('API response:', response);

      setCves(response.data.data);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching CVEs:', error);
      setCves([]);
      setTotal(0);
      setPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchData({ page, limit });
  }, [page, limit]); // Only re-fetch data when pagination changes

  // Function to handle the "Refresh" button click
  const handleRefresh = () => {
    const params = {
      page,
      limit,
      id,
      year,
      score,
      lastModifiedDays,
    };
    fetchData(params);
  };

  const handleRowClick = (cveId) => {
    // Open a new window/tab with the CVE details URL
    window.open(`/cves/${cveId}`, '_blank');
  };

  return (
    <div className="cve-container">
      <h1>CVE List</h1>
      <div className="filters">
        <div className="filter-group">
          <label>
            CVE ID:
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g., CVE-1999-0095"
            />
          </label>
          <label>
            Year:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 1990"
            />
          </label>
        </div>
        <div className="filter-group">
          <label>
            Score:
            <input
              type="number"
              step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g., 10"
            />
          </label>
          <label>
            Last Modified (Days):
            <input
              type="number"
              value={lastModifiedDays}
              onChange={(e) => setLastModifiedDays(e.target.value)}
              placeholder="e.g., 30"
            />
          </label>
        </div>
        <div className="pagination-controls">
          <label>
            Page:
            <input
              type="number"
              min="1"
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value) || 1)}
            />
          </label>
          <label>
            Limit:
            <input
              type="number"
              min="1"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
            />
          </label>
          <button onClick={handleRefresh} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      <div className="summary">
        Showing {cves.length} of {total} CVEs
      </div>
      <div className="table-container">
        <table className="cve-table">
          <thead>
            <tr>
              <th>CVE</th>
              <th>Identifier</th>
              <th>Published Date</th>
              <th>Last Modified Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cves.map((cve, index) => (
              <tr key={index} onClick={() => handleRowClick(cve.id)}>
                <td>{cve.id}</td>
                <td>{cve.sourceIdentifier}</td>
                <td>{cve.published ? new Date(cve.published).toLocaleDateString() : '-'}</td>
                <td>{cve.lastModified ? new Date(cve.lastModified).toLocaleDateString() : '-'}</td>
                <td>{cve.vulnStatus}</td>
              </tr>
            ))}
            {cves.length === 0 && (
              <tr>
                <td colSpan="5">No CVEs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-info">
        Page {page} of {pages}
      </div>
      <div className="pagination-buttons">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => (prev < pages ? prev + 1 : prev))}
          disabled={page >= pages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CveList;
