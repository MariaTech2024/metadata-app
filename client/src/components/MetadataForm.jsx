import React, { useState } from 'react';
import axios from 'axios';
import MetadataCard from './MetadataCard';

function MetadataForm() {
  const [urls, setUrls] = useState(['', '', '']);
  const [metadata, setMetadata] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (index, event) => {
    const newUrls = [...urls];
    let url = event.target.value;

    if (url && !/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    newUrls[index] = url;
    setUrls(newUrls);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMetadata([]);
    setLoading(true);

    const invalidUrls = urls.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      setLoading(false);
      setError(`Invalid URL(s): ${invalidUrls.join(', ')}`);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/fetch-metadata', { urls });
      const data = response.data;

      if (data.some(item => item.error)) {
        throw new Error(data.find(item => item.error).error);
      }

      setMetadata(data);
    } catch (err) {
      setError('Failed to fetch metadata. Please check the URLs and try again. Details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="metadata-form-container">
      <h1>Fetch URL Metadata</h1>
      <form onSubmit={handleSubmit}>
        {urls.map((url, index) => (
          <div key={index}>
            <input
              type="text"
              value={url}
              onChange={(event) => handleUrlChange(index, event)}
              placeholder="Enter URL"
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading}>Submit</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading && <p className="loading">Loading...</p>}

      <div className="metadata-cards-container">
        {metadata.map((data, index) => (
          <MetadataCard
            key={index}
            data={data}
            onCardClick={() => handleCardClick(data.url)}
          />
        ))}
      </div>
    </div>
  );
}

export default MetadataForm;