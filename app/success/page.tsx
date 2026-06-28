export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-24">
      <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-md border border-green-200">
        <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your seed purchase. Your order is being batched for weekly fulfillment.</p>
      </div>
    </main>
  );
}
