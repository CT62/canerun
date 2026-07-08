// Replace the hardcoded 'packages' section inside your webhook's ShipEngine API block with this logic:
const lineItemsExpanded = await stripe.checkout.sessions.listLineItems(session.id);

// Compute aggregate ounces based on line-item parameters
let totalOunces = 0;
lineItemsExpanded.data.forEach(item => {
  // Pull data from metadata values passed earlier
  const weight = parseFloat(item.price.product.metadata.weightOz || 1); 
  totalOunces += (weight * item.quantity);
});

// Pass this dynamic sum straight into your package block configuration:
packages: [
  {
    weight: { value: Math.max(totalOunces, 1), unit: 'ounce' } 
  }
]
