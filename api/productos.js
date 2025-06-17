import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase.mjs'; // 👈 archivo separado compatible con módulos ES

export default async function handler(req, res) {
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

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
    console.error('🔥 ERROR en /api/productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}
