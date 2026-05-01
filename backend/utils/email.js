const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOrderNotification = async (order) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;">${item.name}</td>
      <td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;text-align:center;">${item.size || '-'}</td>
      <td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;text-align:center;">${item.color || '-'}</td>
      <td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;text-align:center;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#c9a96e;text-align:right;">${item.price.toFixed(2)} €</td>
    </tr>
  `).join('');

  const mailToAdmin = {
    from: `"LUXE Store" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🛍️ Porosi e Re #${order.orderNumber} - LUXE Store`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:620px;margin:0 auto;background:#111111;border:1px solid #222;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#c9a96e,#a07840);padding:30px;text-align:center;">
            <h1 style="margin:0;color:#0a0a0a;font-size:28px;font-weight:900;letter-spacing:4px;">LUXE</h1>
            <p style="margin:5px 0 0;color:#0a0a0a;font-size:12px;letter-spacing:3px;opacity:0.8;">STORE · FASHION</p>
          </div>
          <!-- Body -->
          <div style="padding:30px;">
            <h2 style="color:#c9a96e;margin:0 0 5px;font-size:20px;">🛍️ Porosi e Re!</h2>
            <p style="color:#888;margin:0 0 25px;font-size:14px;">Numri i porosisë: <strong style="color:#fff;">#${order.orderNumber}</strong></p>
            
            <!-- Customer Info -->
            <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;border-left:3px solid #c9a96e;">
              <h3 style="color:#c9a96e;margin:0 0 15px;font-size:14px;text-transform:uppercase;letter-spacing:2px;">Informacioni i Klientit</h3>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="color:#888;padding:4px 0;width:40%;">Emri:</td><td style="color:#fff;padding:4px 0;">${order.customer.firstName} ${order.customer.lastName}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Email:</td><td style="color:#fff;padding:4px 0;">${order.customer.email}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Tel:</td><td style="color:#fff;padding:4px 0;">${order.customer.phone}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Adresa:</td><td style="color:#fff;padding:4px 0;">${order.customer.address}, ${order.customer.city}</td></tr>
                ${order.customer.notes ? `<tr><td style="color:#888;padding:4px 0;">Shënime:</td><td style="color:#fff;padding:4px 0;">${order.customer.notes}</td></tr>` : ''}
              </table>
            </div>
            
            <!-- Products -->
            <h3 style="color:#c9a96e;margin:0 0 10px;font-size:14px;text-transform:uppercase;letter-spacing:2px;">Produktet</h3>
            <table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background:#222;">
                  <th style="padding:10px;text-align:left;color:#888;font-size:12px;font-weight:400;">Produkti</th>
                  <th style="padding:10px;text-align:center;color:#888;font-size:12px;font-weight:400;">Madhësia</th>
                  <th style="padding:10px;text-align:center;color:#888;font-size:12px;font-weight:400;">Ngjyra</th>
                  <th style="padding:10px;text-align:center;color:#888;font-size:12px;font-weight:400;">Sasia</th>
                  <th style="padding:10px;text-align:right;color:#888;font-size:12px;font-weight:400;">Çmimi</th>
                </tr>
              </thead>
              <tbody>${itemsHTML}</tbody>
            </table>
            
            <!-- Totals -->
            <div style="background:#1a1a1a;border-radius:8px;padding:15px 20px;margin-top:20px;">
              <div style="display:flex;justify-content:space-between;padding:5px 0;color:#888;"><span>Nëntotali:</span><span>${order.subtotal.toFixed(2)} €</span></div>
              <div style="display:flex;justify-content:space-between;padding:5px 0;color:#888;"><span>Transporti:</span><span>${order.shipping === 0 ? 'Falas' : order.shipping.toFixed(2) + ' €'}</span></div>
              <div style="display:flex;justify-content:space-between;padding:10px 0 0;border-top:1px solid #333;margin-top:5px;">
                <span style="color:#c9a96e;font-size:18px;font-weight:700;">TOTAL:</span>
                <span style="color:#c9a96e;font-size:18px;font-weight:700;">${order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
          <!-- Footer -->
          <div style="padding:20px;text-align:center;border-top:1px solid #222;">
            <p style="color:#555;font-size:12px;margin:0;">© ${new Date().getFullYear()} LUXE Store · Të gjitha të drejtat e rezervuara</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  const mailToCustomer = {
    from: `"LUXE Store" <${process.env.EMAIL_USER}>`,
    to: order.customer.email,
    subject: `✅ Konfirmim Porosie #${order.orderNumber} - LUXE Store`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:620px;margin:0 auto;background:#111111;border:1px solid #222;">
          <div style="background:linear-gradient(135deg,#c9a96e,#a07840);padding:30px;text-align:center;">
            <h1 style="margin:0;color:#0a0a0a;font-size:28px;font-weight:900;letter-spacing:4px;">LUXE</h1>
            <p style="margin:5px 0 0;color:#0a0a0a;font-size:12px;letter-spacing:3px;opacity:0.8;">STORE · FASHION</p>
          </div>
          <div style="padding:30px;">
            <h2 style="color:#fff;margin:0 0 10px;">Faleminderit për porosinë tuaj, ${order.customer.firstName}! 🎉</h2>
            <p style="color:#888;margin:0 0 25px;">Porosia juaj <strong style="color:#c9a96e;">#${order.orderNumber}</strong> u pranua me sukses. Do t'ju kontaktojmë për konfirmim.</p>
            <div style="background:#1a1a1a;border-radius:8px;padding:20px;text-align:center;border:1px solid #c9a96e33;">
              <p style="color:#888;margin:0 0 5px;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Totali i Porosisë</p>
              <p style="color:#c9a96e;font-size:32px;font-weight:900;margin:0;">${order.total.toFixed(2)} €</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailToAdmin);
  await transporter.sendMail(mailToCustomer);
};

module.exports = { sendOrderNotification };
