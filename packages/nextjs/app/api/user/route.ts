import getConfig from "next/config";
import { DuplicateUserError } from "../../../models/errors";
import { User } from "../../../models/user";
import { saveUser } from "../../../services/mongo/mongo";
import { Resolver, parse } from "did-resolver";
import ethr from "ethr-did-resolver";

export async function POST(request: Request) {
  const { serverRuntimeConfig } = getConfig();
  const ethrResolver = ethr.getResolver(serverRuntimeConfig.providerConfig);
  const resolver = new Resolver(ethrResolver);

  const user: User = await request.json();
  const did = parse(user.id);
  const doc = await resolver.resolve(user.id);
  if (doc.didResolutionMetadata.error || did === null) {
    return new Response(`invalid user id: ${user.id}.`, { status: 400 });
  }

  user.address = did.id;
  try {
    await saveUser(user);
    return new Response(`user ${user.address} ${user.name} joined.`, { status: 400 });
  } catch (err) {
    if (err instanceof DuplicateUserError) {
      return new Response(`user ${user.id} already exists.`, { status: 400 });
    } else {
      return new Response(`internal server error: ${err}.`, { status: 500 });
    }
  }
}
