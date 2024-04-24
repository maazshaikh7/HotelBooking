import React from 'react';

function StarRating({ value, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div>
      {stars.map((star, index) => (
        <span
          key={index}
          style={{
            color: star <= value ? 'orange' : 'gray',
            cursor: 'pointer',
            fontSize:'30px'
          }}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
