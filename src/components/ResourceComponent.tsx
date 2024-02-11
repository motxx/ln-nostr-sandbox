import React, { useState, useEffect } from 'react';
import axios from 'axios';

export type Resource = {
  imageUrl: string;
};

function ResourceComponent() {
  const [resource, setResource] = useState(null as Resource | null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://example.com/api/resource')
      .then(response => {
        setResource(response.data); // Assuming response.data contains the URL to the image
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.response && error.response.status === 402) {
          console.log('Intervene: Payment required for this resource.');
          setError('Payment required.');
        } else {
          setError('An error occurred while fetching the resource.');
        }
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {resource && <img src={resource.imageUrl} alt="Resource" />}
    </div>
  );
}

export default ResourceComponent;