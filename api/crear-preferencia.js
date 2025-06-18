import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items, nombre, email } = req.body;

  if (!items || !email || !nombre) {
    return res.status(400).json({ error: 'Faltan datos para la preferencia' });
  }

  try {
    const preference = {
      items: items.map(item => ({
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: parseFloat(item.precio),
      })),
      payer: { email },
      metadata: { nombre, email },
      back_urls: {
        success: 'https://blossom-frontend.vercel.app/checkout?status=success',
        failure: 'https://blossom-frontend.vercel.app/checkout?status=failure',
        pending: 'https://blossom-frontend.vercel.app/checkout?status=pending',
      },
      auto_return: 'approved',
      notification_url: 'https://blossom-backend.vercel.app/api/webhook',
    };

    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
}
