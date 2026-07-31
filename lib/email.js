import { Resend } from 'resend';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const SUPPORT_EMAIL = 'admin@canerunenterprises.com';
const SUPPORT_PHONE = '(618) 456-8851';
const SUPPORT_PHONE_TEL = '+16184568851';

const supportHtml = `
  <p style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;color:#475569;">
    Have questions about your order? Contact us at:<br/>
    <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a><br/>
    <a href="tel:${SUPPORT_PHONE_TEL}">${SUPPORT_PHONE}</a>
  </p>
`;

// Builds a carrier tracking-page URL for a given tracking number, so the customer can click
// straight through instead of copy-pasting it into the carrier's site themselves.
function trackingUrlFor(carrierCode, trackingNumber) {
  const code = (carrierCode || '').toLowerCase();
  const number = encodeURIComponent(trackingNumber);
  if (code.includes('fedex')) return `https://www.fedex.com/fedextrack/?trknbr=${number}`;
  if (code.includes('ups')) return `https://www.ups.com/track?loc=en_US&tracknum=${number}`;
  if (code.includes('stamps') || code.includes('usps')) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${number}`;
  return null;
}

// Renders one tracking line per bag when the order shipped as multiple packages
// (e.g. an order needing several small/medium/large bags), or a single line otherwise.
// Intentionally does not link to the shipping label itself — that's for our own use.
function trackingHtml(tracking) {
  const packages = tracking.packages?.length > 0 ? tracking.packages : [{ trackingNumber: tracking.trackingNumber }];
  const carrier = tracking.carrierCode ? ` (${escapeHtml(tracking.carrierCode)})` : '';
  return packages
    .map((pkg, i) => {
      const url = trackingUrlFor(tracking.carrierCode, pkg.trackingNumber);
      const number = escapeHtml(pkg.trackingNumber);
      const trackingText = url ? `<a href="${escapeHtml(url)}">${number}</a>` : number;
      const label = packages.length > 1 ? `Bag ${i + 1} tracking` : 'Tracking number';
      return `<p style="margin:2px 0;"><strong>${label}:</strong> ${trackingText}${carrier}</p>`;
    })
    .join('');
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
    ? trackingHtml(tracking)
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
      ${supportHtml}
    </div>
  `;

  // Testing-mode: also bcc ORDER_NOTIFY_EMAIL so someone sees new orders come in.
  // Swap this env var to the real admin address once out of testing.
  const notify = process.env.ORDER_NOTIFY_EMAIL;

  await resend.emails.send({
    from,
    to,
    ...(notify ? { bcc: notify } : {}),
    subject: fulfillment === 'pickup' ? 'Your Cane Run order is confirmed' : 'Cane Run order receipt',
    html,
  });
}

// Internal-only email so whoever's packing orders can print the label(s) — the customer
// email deliberately never links to these. Sent once a real label has been purchased.
export async function sendShippingLabelEmail({ to, items, shipTo, tracking }) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Skipping shipping label email: RESEND_API_KEY is not configured.');
    return;
  }
  if (!to) {
    console.error('Skipping shipping label email: no recipient configured (ORDER_NOTIFY_EMAIL).');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.ORDER_FROM_EMAIL || 'orders@canerun.example.com';

  const itemRows = items
    .map((item) => `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.name)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;">${item.quantity}</td>
    </tr>`)
    .join('');

  const packages = tracking.packages?.length > 0
    ? tracking.packages
    : [{ trackingNumber: tracking.trackingNumber, labelUrl: tracking.labelUrl, carrierCode: tracking.carrierCode }];

  const labelRows = packages
    .map((pkg, i) => {
      const label = packages.length > 1 ? `Bag ${i + 1}` : 'Label';
      const carrier = pkg.carrierCode || tracking.carrierCode || '';
      const link = pkg.labelUrl
        ? `<a href="${escapeHtml(pkg.labelUrl)}">Print label</a>`
        : 'No label file available';
      return `<p style="margin:4px 0;"><strong>${label}</strong> — ${escapeHtml(pkg.trackingNumber)}${carrier ? ` (${escapeHtml(carrier)})` : ''}: ${link}</p>`;
    })
    .join('');

  const addressHtml = shipTo
    ? `<p style="margin:2px 0;">
        ${escapeHtml(shipTo.name)}<br/>
        ${escapeHtml(shipTo.addressLine1)}${shipTo.addressLine2 ? `<br/>${escapeHtml(shipTo.addressLine2)}` : ''}<br/>
        ${escapeHtml(shipTo.cityLocality)}, ${escapeHtml(shipTo.stateProvince)} ${escapeHtml(shipTo.postalCode)}
      </p>`
    : '';

  const html = `
    <div style="font-family:sans-serif;color:#0f172a;">
      <h2 style="margin-bottom:4px;">New order — shipping label${packages.length > 1 ? 's' : ''} ready</h2>
      <table style="border-collapse:collapse;width:100%;max-width:480px;margin:12px 0;">
        <thead>
          <tr>
            <th align="left" style="padding:6px 10px;border-bottom:2px solid #0f172a;">Item</th>
            <th align="left" style="padding:6px 10px;border-bottom:2px solid #0f172a;">Qty</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="font-weight:bold;margin-bottom:2px;">Ship to:</p>
      ${addressHtml}
      <div style="margin-top:16px;">${labelRows}</div>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    subject: `New order — print shipping label${packages.length > 1 ? 's' : ''}`,
    html,
  });
}
