import getConfig from "next/config";
import { DuplicateUserError } from "../../../models/errors";
import { User } from "../../../models/user";
import { saveUser, getAllUsers } from "../../../services/mongo/mongo";
import { Resolver, parse } from "did-resolver";
import ethr from "ethr-did-resolver";

export async function POST(request: Request) {
  const { serverRuntimeConfig: { providerConfig: providerConfig } } = getConfig();
  const ethrResolver = ethr.getResolver(providerConfig);
  const resolver = new Resolver(ethrResolver);

  const user: User = await request.json();
  try {
    await resolver.resolve(user.id);
  } catch (err) {
    return new Response(`resolve error: invalid user id: ${user.id} ${err}.`, { status: 400 });
  }

  const did = parse(user.id);
  if (!did) {
    return new Response(`parse error: invalid user id: ${user.id}.`, { status: 400 });
  }
  user.address = did.id;

  try {
    await saveUser(user);
    return new Response(`user ${user.address} ${user.name} joined.`, { status: 200 });
  } catch (err) {
    if (err instanceof DuplicateUserError) {
      return new Response(`user ${user.id} already exists.`, { status: 400 });
    } else {
      console.log('user join error: ', err);
      if (err instanceof Error) {
        console.log(err.stack);
      }
      return new Response(`internal server error.`, { status: 500 });
    }
  }
}

export async function GET() {
  try {
    const users = await getAllUsers();
    return Response.json(users, { status: 200 });
  } catch (err) {
    console.log('get all users error: ',err);
    if (err instanceof Error) {
      console.log(err.stack);
    }
    return new Response(`internal server error.`, { status: 500 });
  }
}
