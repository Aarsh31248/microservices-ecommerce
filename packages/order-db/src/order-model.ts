import mongoose, { InferSchemaType, model } from "mongoose";
const { Schema } = mongoose;

export const OrderStatus = ["success", "failed"] as const;

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: OrderStatus },
    products: {
      type: [
        {
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;

export const Order = model<OrderSchemaType>("Order", OrderSchema);