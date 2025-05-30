export default function handler(req, res) {
  const productos = [
    {
      id: '1',
      nombre: 'Remera Blossom',
      descripcion: 'Remera de algodón premium con diseño exclusivo.',
      precio: 4999,
      imagenUrl: 'https://via.placeholder.com/300x200',
      categoria: 'indumentaria',
      promo: true
    },
    {
      id: '2',
      nombre: 'Tote Bag',
      descripcion: 'Bolso ecológico reutilizable con diseño artístico.',
      precio: 2999,
      imagenUrl: 'https://via.placeholder.com/300x200',
      categoria: 'accesorios',
      promo: false
    }
  ];

  res.status(200).json(productos);
}
