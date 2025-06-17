const { db } = require('../lib/firebase.js');
const { collection, getDocs } = require('firebase/firestore');

module.exports = async function (req, res) {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://www.mitienda.com',
    'https://blossom-frontend.vercel.app',
    'https://blossom-frontend-iota.vercel.app'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const snapshot = await getDocs(collection(db, 'productos'));
    const productos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(productos);
  } catch (err) {
    console.error('🔥 ERROR en /api/productos:', JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};
