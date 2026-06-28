'use client';

export default function HomePage() {
  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    
    if (data.url) {
      window.location.href = data.url; // Redirects user to secure Stripe screen
    } else {
      alert('Checkout failed to initialize.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-24">
      <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Seed Co. Storefront</h1>
        <p className="text-gray-600 mb-6">High-quality bulk processing seeds shipped weekly.</p>
        
        <button 
          onClick={handleCheckout}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-sm"
        >
          Buy Now ($15.00)
        </button>
      </div>
    </main>
  );
}
