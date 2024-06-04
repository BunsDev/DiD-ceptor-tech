import getConfig from "next/config";
import amqplib from "amqplib";

const {
  serverRuntimeConfig: { queueConfig: queueConfig },
} = getConfig();

if (!queueConfig.rabbitMqUrl) {
  throw new Error("rabbitmq url is missing, please check RABIITMQ_URL in your env file");
}

if (!queueConfig.rabbitMqQueue) {
  throw new Error("rabbitmq queue is missing, please check RABBITMQ_QUEUE in your env file");
}

const connection = await amqplib.connect(queueConfig.rabbitMqUrl);
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

export async function send(msgs: any[]) {
  channel.assertQueue(queueConfig.rabbitMqQueue, { durable: false });
  for (const msg of msgs) {
    const content = JSON.stringify(msg);
    channel.sendToQueue(queueConfig.rabbitMqQueue, Buffer.from(content));
  }
}
