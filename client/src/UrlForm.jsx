import React, { useState } from 'react';
import axios from 'axios';

const UrlForm = () => {
    const [urls, setUrls] = useState(['', '', '']);
    const [metadata, setMetadata] = useState([]);
    const [error, setError] = useState('');

    const handleInputChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMetadata([]);

        try {
            const response = await axios.get('http://localhost:5000/fetch-metadata', { urls });
            setMetadata(response.data);
        } catch (error) {
            setError('Failed to fetch metadata. Please check the URLs and try again.');
        }
    };

    return (
        <div>
            <h1>URL Metadata Fetcher</h1>
            <form onSubmit={handleSubmit}>
                {urls.map((url, index) => (
                    <input
                        key={index}
                        type="text"
                        value={url}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder={`URL ${index + 1}`}
                        required
                    />
                ))}
                <button type="submit">Submit</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                {metadata.map((data, index) => (
                    <div key={index} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
                        <h3>{data.title}</h3>
                        <p>{data.description}</p>
                        {data.image && <img src={data.image} alt="metadata" style={{ width: '100px' }} />}
                        {data.error && <p style={{ color: 'red' }}>{data.error}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UrlForm;