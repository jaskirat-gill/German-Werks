// src/subscribers/order-created.js

const sendOrderNotification = require('../services/order-notification');

class OrderCreatedSubscriber {
  constructor({ eventBusService }) {
    this.eventBusService = eventBusService;
    this.eventBusService.subscribe('order.placed', this.handleOrderPlaced.bind(this));
  }

  async handleOrderPlaced(data) {
    const { id } = data;

    try {
      // Retrieve the full order details
      const orderService = this.eventBusService.scope.resolve('orderService');
      const order = await orderService.retrieve(id, {
        relations: ['items', 'customer'],
      });

      // Send the notification email
      await sendOrderNotification(order);
    } catch (error) {
      console.error(`Failed to send order notification for order ${id}:`, error);
    }
  }
}

module.exports = OrderCreatedSubscriber;
