import {
  OrderService,
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/medusa";

type OrderPlacedEvent = {
  id: string;
  no_notification: boolean;
};

export default async function orderPlacedHandler({
  data,
  eventName,
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const orderService: OrderService = container.resolve(OrderService as any);

  const order = await orderService.retrieve(data.id, {
    relations: ["items", "items.variant", "items.variant.product"],
  });

  const sendGridService = container.resolve("sendgridService")  

  sendGridService.sendEmail({  
    templateId: process.env.SENDGRID_ORDER_PLACED_ID,  
    from: "gilljaskirat04@gmail.com",  
    to: [order.email, "jaskiratmacos@gmail.com"], // Add your email here
    dynamic_template_data: {  
      items: order.items,  
      status: order.status,  
    },  
  })  
  
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
};