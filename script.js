document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const paymentDiv = document.getElementById("paymentSummary");

  if (cart.length === 0) {
    paymentDiv.innerHTML = "No order to display.";
    return;
  }

  let tableHTML = `
    <table>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
  `;

  cart.forEach(item => {
    const itemTotal = item.qty * item.price;
    tableHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>₹${item.price}</td>
        <td>₹${itemTotal}</td>
      </tr>
    `;
  });

  const subtotal = localStorage.getItem("paymentSubtotal") || 0;
  const tax = localStorage.getItem("paymentTax") || 0;
  const total = localStorage.getItem("paymentTotal") || 0;

  tableHTML += `
    </table>
    <div class="summary">Subtotal: ₹${subtotal}</div>
    <div class="summary">Tax (10%): ₹${tax}</div>
    <div class="summary"><strong>Total: ₹${total}</strong></div>
    <br><button onclick="completePayment()">Pay Now</button>
  `;

  paymentDiv.innerHTML = tableHTML;
});

function completePayment() {
  alert("Payment Successful! Thank you!");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
