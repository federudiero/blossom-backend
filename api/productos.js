import { db } from '../lib/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
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
