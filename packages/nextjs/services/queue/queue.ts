import getConfig from "next/config";
import amqplib from "amqplib";

const { serverRuntimeConfig } = getConfig();

if (!serverRuntimeConfig.queueConfig.rabbitMqUrl) {
  throw new Error("rabbitmq url is missing, please check RABIITMQ_URL in your env file");
}

if (!serverRuntimeConfig.queueConfig.rabbitMqQueue) {
  throw new Error("rabbitmq queue is missing, please check RABBITMQ_QUEUE in your env file");
}

const connection = await amqplib.connect(serverRuntimeConfig.queueConfig.rabbitMqUrl);
connection.on("error", async err => {
  console.log(err);
  if (err instanceof Error) {
    console.log(err.stack);
  }
});

const channel = await connection.createChannel();
channel.on("error", err => {
  console.log(err);
  if (err instanceof Error) {
    console.log(err.stack);
  }
});

export async function send(msgs: string[]) {
  channel.assertQueue(serverRuntimeConfig.queueConfig.rabbitMqQueue, { durable: false });
  for (const msg of msgs) {
    channel.sendToQueue(serverRuntimeConfig.queueConfig.rabbitMqQueue, Buffer.from(msg));
  }
}
