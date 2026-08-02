import { StripeProductType } from "@repo/types";
import stripe from "./stripe";

export const createStripeProduct = async (item: StripeProductType) => {
  try {
    const res = await stripe.products.create({
      id: item.id,
      name: item.name,
      default_price_data: {
        currency: "usd",
        unit_amount: item.price * 100,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getStripeProductPrice = async (productId: number) => {
  try {
    const res = await stripe.prices.list({
      product: productId.toString(),
    });
    return res.data[0]?.unit_amount;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteStripeProduct = async (productId: number) => {
  try {
    const res = await stripe.products.del(productId.toString());
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};