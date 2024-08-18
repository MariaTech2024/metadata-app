import React from 'react';


function MetadataCard({ data, onCardClick }) {
  return (
    <div className="metadata-card" onClick={onCardClick}>
      <div className="card-header">
        <h2>{data.title}</h2>
      </div>
      <div className="card-image">
        {data.image ? (
          <img
            src={data.image}
            alt={data.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/100'; // Fallback image URL
            }}
          />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <div className="card-description">
        <p>{data.description}</p>
      </div>
    </div>
  );
}

export default MetadataCard;