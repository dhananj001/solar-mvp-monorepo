import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get('/api/test')  // Calls backend via proxy
      .then(res => setMessage(res.data.message))
      .catch(err => {
        console.error('API error:', err);
        setMessage('Error connecting to backend');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Solar Business MVP</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;