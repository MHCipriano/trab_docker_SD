import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [item, setItem] = useState('');
  const [selectedDB, setSelectedDB] = useState('mongo1');
  const [exists, setExists] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, [selectedDB]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/items/${selectedDB}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const insertItem = async () => {
    try {
      await axios.post(`http://localhost:5000/insert/${selectedDB}`, { item });
      alert('Item inserido');
      setItem(''); // Clear input after insertion
      fetchItems(); // Refresh item list
    } catch (error) {
      alert('Error inserting item');
    }
  };

  const deleteItem = async (itemToDelete) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${selectedDB}`, { data: { item: itemToDelete } });
      alert('Item removido');
      fetchItems(); // Refresh item list
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const checkExists = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/exists?item=${item}`);
      setExists(response.data);
    } catch (error) {
      alert('Error checking item existence');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Gerenciar itens</h1>
      <input
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        placeholder="item"
        style={{ padding: '10px', margin: '10px' }}
      />
      <br />
      <select
        value={selectedDB}
        onChange={(e) => setSelectedDB(e.target.value)}
        style={{ padding: '10px', margin: '10px' }}
      >
        <option value="mongo1">DB_1</option>
        <option value="mongo2">DB_2</option>
      </select>
      <br />
      <button onClick={insertItem} style={{ margin: '10px' }}>Inserir</button>
      <button onClick={checkExists} style={{ margin: '10px' }}>Checar Presença</button>
      <div style={{ marginTop: '20px' }}>
        {exists !== null && (
          <div>
            <p>Presente em DB_1: {exists.existsInMongo1 ? 'Sim' : 'Não'}</p>
            <p>Presente em DB_2: {exists.existsInMongo2 ? 'Sim' : 'Não'}</p>
          </div>
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Itens</h2>
        <ul>
          {items.map(item => (
            <li key={item._id}>
              {item.name}
              <button onClick={() => deleteItem(item.name)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
