import { db } from '../lib/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  // Lista de dominios permitidos
  const allowedOrigins = [
  'http://localhost:5173',
  'https://www.mitienda.com',
  'https://blossom-frontend.vercel.app',
  'https://blossom-frontend-iota.vercel.app' // ✅ corregido
];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Para preflight request (CORS OPTION)
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
}
