import { db } from '../lib/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  // Lista de dominios permitidos
  const allowedOrigins = [
    'http://localhost:5173',           // desarrollo local (Vite)
    'https://www.mitienda.com',        // dominio final en Hostinger (ajustalo cuando lo tengas)
    'https://blossom-frontend.vercel.app',
    'blossom-frontend-iota.vercel.app'
    
 // si aún estás usando Vercel para el frontend
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
