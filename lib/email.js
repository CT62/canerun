import { Resend } from 'resend';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export async function sendOrderConfirmationEmail({ to, items, total, fulfillment, tracking }) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Skipping order confirmation email: RESEND_API_KEY is not configured.');
    return;
  }
  if (!to) {
    console.error('Skipping order confirmation email: no customer email on the checkout session.');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.ORDER_FROM_EMAIL || 'orders@canerun.example.com';

  const itemRows = items
    .map((item) => `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.name)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;">${item.quantity}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;">$${item.amount.toFixed(2)}</td>
    </tr>`)
    .join('');

  const fulfillmentHtml = tracking
    ? `<p><strong>Tracking number:</strong> ${escapeHtml(tracking.trackingNumber)} (${escapeHtml(tracking.carrierCode || '')})</p>`
    : fulfillment === 'pickup'
      ? '<p>We&#39;ll email you again as soon as your batch is ready for pickup.</p>'
      : '<p>Your shipping label is being prepared — we&#39;ll follow up with tracking details shortly.</p>';

  const html = `
    <div style="font-family:sans-serif;color:#0f172a;">
      <h2 style="margin-bottom:4px;">Thanks for your order!</h2>
      <p style="color:#475569;margin-top:0;">Here's a receipt for what you purchased.</p>
      <table style="border-collapse:collapse;width:100%;max-width:480px;">
        <thead>
          <tr>
            <th align="left" style="padding:6px 10px;border-bottom:2px solid #0f172a;">Item</th>
            <th align="left" style="padding:6px 10px;border-bottom:2px solid #0f172a;">Qty</th>
            <th align="left" style="padding:6px 10px;border-bottom:2px solid #0f172a;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="margin-top:16px;"><strong>Total charged: $${total.toFixed(2)}</strong></p>
      ${fulfillmentHtml}
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    subject: fulfillment === 'pickup' ? 'Your Cane Run order is confirmed' : 'Your Cane Run order has shipped',
    html,
  });
}
