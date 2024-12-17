import React, { useEffect, useState } from 'react';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

const TestFirebaseRead: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const testRef = ref(database, 'test');
    onValue(testRef, (snapshot) => {
      const data = snapshot.val();
      setMessage(data?.message || 'No hay mensaje');
    });
  }, []);

  return (
    <div>
      <h1>Prueba de Lectura de Firebase</h1>
      <p>Mensaje desde Firebase: {message}</p>
    </div>
  );
};

export default TestFirebaseRead;
