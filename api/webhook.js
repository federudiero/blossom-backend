import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método no permitido');

  const data = req.body;

  if (data.type === 'payment') {
    const paymentId = data.data.id;

    try {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      });

      const payment = await mpRes.json();

      if (payment.status === 'approved') {
        const nombre = payment.metadata?.nombre || 'Cliente';
        const email = payment.metadata?.email;
        const total = payment.transaction_amount;
        const metodo = payment.payment_method_id;
        const fecha = new Date().toLocaleString('es-AR');

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Blossom Tienda" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: '✅ Confirmación de compra - Blossom',
          html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #d63384;">¡Hola ${nombre}!</h2>
              <p>Tu pago fue <strong>aprobado con éxito</strong> 🎉</p>
              <p><strong>Detalles de tu compra:</strong></p>
              <ul>
                <li><strong>Monto:</strong> $${total}</li>
                <li><strong>Método de pago:</strong> ${metodo}</li>
                <li><strong>Fecha:</strong> ${fecha}</li>
              </ul>
              <p>En un plazo de <strong>24 a 72 horas</strong> hábiles recibirás tu pedido.</p>
              <p>Si querés compartir tu comprobante o hacer una consulta, escribinos a WhatsApp:</p>
              <p style="font-size: 18px;"><a href="https://wa.me/5493514597991" style="color: #25D366;">+54 9 351 459-7991</a></p>
              <br/>
              <p>¡Gracias por elegir Blossom! 🌸</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email enviado a ${email}`);
      }

      return res.status(200).send('OK');
    } catch (err) {
      console.error('❌ Error en webhook:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
  } else {
    return res.status(200).send('Evento ignorado');
  }
}
