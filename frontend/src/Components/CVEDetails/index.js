import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './index.css'; // For styling

function CveDetail() {
  const [cve, setCve] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchCveDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/cves?id=${id}`);
        setCve(response.data.data[0]); // Assuming the API returns an array
      } catch (error) {
        console.error('Error fetching CVE details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCveDetails();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cve-detail-container">
      <h1>{cve?.id}</h1>

      {/* Description */}
      <div className="section">
        <h2>Description:</h2>
        <p>{cve?.descriptions?.find(d => d.lang === 'en')?.value || 'No description available'}</p>
      </div>

      {/* CVSS V2 Metrics */}
      <div className="section">
        <h2>CVSS V2 Metrics:</h2>
        <div className="metrics">
          <p><strong>Severity:</strong> LOW</p>
          <p><strong>Score:</strong> {cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 'N/A'}</p>
          <p><strong>Vector String:</strong> {cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.vectorString || 'N/A'}</p>
        </div>
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Access Vector</th>
              <th>Access Complexity</th>
              <th>Authentication</th>
              <th>Confidentiality Impact</th>
              <th>Integrity Impact</th>
              <th>Availability Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.accessVector || 'N/A'}</td>
              <td>{cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.accessComplexity || 'N/A'}</td>
              <td>{cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.authentication || 'N/A'}</td>
              <td>{cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.confidentialityImpact || 'N/A'}</td>
              <td>{cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.integrityImpact || 'N/A'}</td>
              <td>{cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.availabilityImpact || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Scores */}
      <div className="section">
        <h2>Scores:</h2>
        <p><strong>Exploitability Score:</strong> {cve?.metrics?.cvssMetricV2?.[0]?.exploitabilityScore || 'N/A'}</p>
        <p><strong>Impact Score:</strong> {cve?.metrics?.cvssMetricV2?.[0]?.impactScore || 'N/A'}</p>
      </div>

      {/* CPE Table */}
      <div className="section">
        <h2>CPE:</h2>
        <table className="cpe-table">
          <thead>
            <tr>
              <th>Criteria</th>
              <th>Match Criteria ID</th>
              <th>Vulnerable</th>
            </tr>
          </thead>
          <tbody>
            {cve?.configurations?.[0]?.nodes?.[0]?.cpeMatch?.map((cpe, index) => (
              <tr key={index}>
                <td>{cpe.criteria || 'N/A'}</td>
                <td>{cpe.matchCriteriaId || 'N/A'}</td>
                <td>{cpe.vulnerable ? 'Yes' : 'No'}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan="3">No CPE data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CveDetail;
