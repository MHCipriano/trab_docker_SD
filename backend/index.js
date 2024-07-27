const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Adicione esta linha

const app = express();
app.use(express.json());
app.use(cors()); // Adicione esta linha

// Conectar com MongoDB
const mongoClient1 = new MongoClient(process.env.MONGO1_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoClient2 = new MongoClient(process.env.MONGO2_URL, { useNewUrlParser: true, useUnifiedTopology: true });

let mongoDb1, mongoDb2;

// Conectar ao MongoDB1
mongoClient1.connect((err) => {
  if (err) throw err;
  mongoDb1 = mongoClient1.db('testdb1');
  console.log('MongoDB1 connected');
});

// Conectar ao MongoDB2
mongoClient2.connect((err) => {
  if (err) throw err;
  mongoDb2 = mongoClient2.db('testdb2');
  console.log('MongoDB2 connected');
});

// Função para obter o banco de dados apropriado
const getDb = (dbName) => {
  if (dbName === 'mongo1') return mongoDb1;
  if (dbName === 'mongo2') return mongoDb2;
  throw new Error('Invalid database');
};

// Rota para inserir um item
app.post('/insert/:db', (req, res) => {
  const { item } = req.body;
  const dbName = req.params.db;
  const db = getDb(dbName);
  db.collection('items').insertOne({ name: item }, (err, result) => {
    if (err) throw err;
    res.send(`Item inserted into ${dbName}`);
  });
});

// Rota para deletar um item
app.delete('/delete/:db', (req, res) => {
  const { item } = req.body;
  const dbName = req.params.db;
  const db = getDb(dbName);
  db.collection('items').deleteOne({ name: item }, (err, result) => {
    if (err) throw err;
    res.send(`Item deleted from ${dbName}`);
  });
});

// Rota para listar todos os itens em um banco específico
app.get('/items/:db', (req, res) => {
  const dbName = req.params.db;
  const db = getDb(dbName);
  db.collection('items').find({}).toArray((err, items) => {
    if (err) throw err;
    res.json(items);
  });
});

// Rota para verificar se um item existe em ambos os bancos
app.get('/exists', (req, res) => {
  const { item } = req.query;
  const checks = {
    mongo1: mongoDb1.collection('items').findOne({ name: item }),
    mongo2: mongoDb2.collection('items').findOne({ name: item })
  };
  Promise.all(Object.values(checks)).then(([existsInMongo1, existsInMongo2]) => {
    res.json({
      existsInMongo1: existsInMongo1 != null,
      existsInMongo2: existsInMongo2 != null
    });
  }).catch(err => res.status(500).send(err.message));
});

// Iniciar o servidor
app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
