import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient("payment-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "payment-group");