import getConfig from "next/config";
import { makeRequest } from "~~/services/eth/request";
import { send } from "~~/services/queue/queue";

export async function POST(request: Request) {
  const {
    serverRuntimeConfig: { emailConfig: emailConfig, queueConfig: queueConfig },
  } = getConfig();

  const recipients = await request.json();
  const msgs = [];
  for (const recipient of recipients) {
    const msg = {
      url: emailConfig.emailServer,
      apiKey: emailConfig.sendGridApiKey,
      from: emailConfig.sender,
      to: recipient.email,
      username: recipient.username,
    };
    msgs.push(msg);
  }

  try {
    console.log("send notification msgs to the queue");
    await send(msgs);

    console.log("trigger chainlink functions");
    await makeRequest("sepolia", [`${queueConfig.rabbitMqEndport}/${queueConfig.rabbitMqQueue}/get`]);
    return new Response(`notification sent.`, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      console.log(err.stack);
    }
    return new Response(`notification sending failed.`, { status: 500 });
  }
}
