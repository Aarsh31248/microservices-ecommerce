import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";
import { producer } from "./kafka";

// export const createOrder = async (order: OrderType) => {
//   const newOrder = new Order(order);

//   try {
//     const order = await newOrder.save();
//     producer.send("order.created", {
//       value: {
//         email: order.email,
//         amount: order.amount,
//         status: order.status,
//       },
//     });
// } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

export const createOrder = async (order: OrderType) => {
  console.log("Creating order:", order);

  const newOrder = new Order(order);

  try {
    const savedOrder = await newOrder.save();

    console.log("Order saved:", savedOrder);

    await producer.send("order.created", {
      value: {
        email: savedOrder.email,
        amount: savedOrder.amount,
        status: savedOrder.status,
      },
    });

    console.log("order.created event sent");
  } catch (err) {
    console.error("Order creation failed:", err);
    throw err;
  }
};