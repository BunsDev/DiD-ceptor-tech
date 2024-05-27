import { send } from "../../../services/queue/queue";

export async function POST(request: Request) {
  const emails: string[] = await request.json();
  try {
    send(emails);
    return new Response(`notification sent.`, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      console.log(err.stack);
    }
    return new Response(`notification sending failed.`, { status: 500 });
  }
}
