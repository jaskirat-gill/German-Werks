// src/services/order-notification.js

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderNotification = async (order) => {
  const msg = {
    to: process.env.STORE_OWNER_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: `New Order Placed: #${order.display_id}`,
    text: `A new order has been placed.\n\nOrder ID: ${order.id}\nCustomer: ${order.email}\nTotal: $${(order.total / 100).toFixed(2)}`,
    html: `
      <h1>New Order Placed</h1>
      <p>A new order has been placed.</p>
      <ul>
        <li><strong>Order ID:</strong> ${order.id}</li>
        <li><strong>Customer:</strong> ${order.email}</li>
        <li><strong>Total:</strong> $${(order.total / 100).toFixed(2)}</li>
      </ul>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Order notification sent for order ${order.id}`);
  } catch (error) {
    console.error(`Error sending order notification: ${error.message}`);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendOrderNotification;
