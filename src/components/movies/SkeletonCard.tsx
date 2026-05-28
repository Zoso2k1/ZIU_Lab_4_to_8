import React from 'react';

export function SkeletonCard() {
  return (
    <div aria-hidden="true" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px', height: '350px' }}>
      <div className="shimmer-bg" style={{ height: '250px', marginBottom: '10px' }} />
      <div className="shimmer-bg" style={{ height: '20px', marginBottom: '10px' }} />
      <div className="shimmer-bg" style={{ height: '15px', width: '50%' }} />
    </div>
  );
}