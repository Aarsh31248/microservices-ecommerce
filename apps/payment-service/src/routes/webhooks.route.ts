// import { Hono } from "hono";
// import Stripe from "stripe";
// import stripe from "../utils/stripe";
// import { producer } from "../utils/kafka";

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
// const webhookRoute = new Hono();

// webhookRoute.get("/", (c) => {
//   return c.json({
//     status: "ok webhook",
//     uptime: process.uptime(),
//     timestamp: Date.now(),
//   });
// });

// webhookRoute.post("/stripe", async (c) => {
//   const body = await c.req.text();
//   const sig = c.req.header("stripe-signature");

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
//   } catch (error) {
//     console.log("Webhook verification failed!");
//     return c.json({ error: "Webhook verification failed!" }, 400);
//   }

//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object as Stripe.Checkout.Session;

//       const lineItems = await stripe.checkout.sessions.listLineItems(
//         session.id
//       );
//       // TODO: CREATE ORDER
//       producer.send("payment.successful", {
//         value: {
//           userId: session.client_reference_id,
//           email: session.customer_details?.email,
//           amount: session.amount_total,
//           status: session.payment_status === "paid" ? "success" : "failed",
//           products: lineItems.data.map((item) => ({
//             name: item.description,
//             quantity: item.quantity,
//             price: item.price?.unit_amount,
//           })),
//         },
//       });

//       break;

//     default:
//       break;
//   }
//   return c.json({ received: true });
// });

// export default webhookRoute;


import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";
import { producer } from "../utils/kafka";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhookRoute = new Hono();

webhookRoute.get("/", (c) => {
  return c.json({
    status: "ok webhook",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

webhookRoute.post("/stripe", async (c) => {
  console.log("======================================");
  console.log("Webhook endpoint hit");

  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  console.log("Stripe Signature:", !!sig);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);

    console.log("Webhook verified successfully");
    console.log("Event type:", event.type);
  } catch (error) {
    console.error("Webhook verification failed!");
    console.error(error);

    return c.json(
      {
        error: "Webhook verification failed!",
      },
      400
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      console.log("checkout.session.completed received");

      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Session ID:", session.id);
      console.log("Customer Email:", session.customer_details?.email);
      console.log("Payment Status:", session.payment_status);

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const payload = {
        userId: session.client_reference_id,
        email: session.customer_details?.email,
        amount: session.amount_total,
        status: session.payment_status === "paid" ? "success" : "failed",
        products: lineItems.data.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          price: item.price?.unit_amount,
        })),
      };

      console.log("Sending Kafka event:");
      console.dir(payload, { depth: null });

      try {
        await producer.send("payment.successful", {
          value: payload,
        });

        console.log("payment.successful sent successfully");
      } catch (err) {
        console.error("Kafka send failed");
        console.error(err);
      }

      break;
    }

    default:
      console.log("Unhandled event:", event.type);
  }

  console.log("Webhook finished");
  console.log("======================================");

  return c.json({ received: true });
});

export default webhookRoute;