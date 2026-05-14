import React from 'react';

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px', height: '350px' }}>
      <div className="skeleton-img shimmer" style={{ height: '250px', background: '#e0e0e0', marginBottom: '10px' }} />
      <div className="skeleton-title shimmer" style={{ height: '20px', background: '#e0e0e0', marginBottom: '10px' }} />
      <div className="skeleton-meta shimmer" style={{ height: '15px', background: '#e0e0e0', width: '50%' }} />
    </div>
  );
}