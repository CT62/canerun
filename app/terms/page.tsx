export const metadata = {
  title: 'Terms & Conditions | Cane Run Enterprises',
  description: 'Terms and conditions for using canerunenterprises.com and purchasing from Cane Run Enterprises.',
};

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By using this website or placing an order with Cane Run Enterprises, LLP ("Cane Run," "we," "us"), you agree to these Terms & Conditions. If you do not agree, please do not use the site or place an order.`,
  },
  {
    title: '2. Products, Pricing & Availability',
    body: `Prices, product descriptions, and availability are subject to change without notice. We make reasonable efforts to keep pricing and inventory accurate, but errors can occur; if a pricing or listing error is discovered on an order, we will contact you before fulfilling it.`,
  },
  {
    title: '3. Orders & Payment',
    body: `Payment is processed securely through Stripe at the time of checkout. We do not store your card details. Placing an order is an offer to purchase, which we may accept or decline (for example, in cases of suspected fraud, pricing errors, or inventory issues).`,
  },
  {
    title: '4. Shipping & Delivery',
    body: `Shipping rates and delivery estimates are calculated at checkout using third-party carriers and are estimates only, not guarantees. Cane Run is not responsible for carrier delays. Risk of loss and title for products pass to you upon delivery to the carrier.`,
  },
  {
    title: '5. Returns & Damaged Shipments',
    body: `Because seed is a perishable agricultural product, returns may not be accepted once an order has been delivered. If your order arrives damaged or there is an issue with your shipment, contact us as soon as possible at admin@canerunenterprises.com or (618) 456-8851 and we'll work with you to resolve it.`,
  },
  {
    title: '6. No Warranty on Germination or Yield',
    body: `Seed performance — germination, stand establishment, and yield — depends on many factors outside our control, including soil, weather, planting method, and management practices. Except as required by applicable seed law, Cane Run makes no warranty, express or implied, regarding germination, yield, or fitness for a particular purpose, and our liability for any seed sold is limited to replacement of the product or refund of the purchase price, at our discretion.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `To the fullest extent permitted by law, Cane Run Enterprises, LLP is not liable for any indirect, incidental, or consequential damages (including lost profits or crop loss) arising from use of this website or purchase of our products. Our total liability for any claim is limited to the amount you paid for the product giving rise to the claim.`,
  },
  {
    title: '8. Governing Law',
    body: `These terms are governed by the laws of the State of Illinois, without regard to conflict-of-law principles.`,
  },
  {
    title: '9. Changes to These Terms',
    body: `We may update these terms from time to time. Continued use of the site after changes are posted means you accept the updated terms.`,
  },
  {
    title: '10. Contact Us',
    body: `Questions about these terms? Reach us at admin@canerunenterprises.com or (618) 456-8851.`,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-600 dark:text-emerald-400">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Terms & Conditions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-4">Last updated: July 30, 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">{section.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
