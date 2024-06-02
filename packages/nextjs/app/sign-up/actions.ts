"use server";

import getConfig from "next/config";
import { Resolver, parse } from "did-resolver";
import ethr from "ethr-did-resolver";
import { DuplicateUserError } from "~~/models/errors";
import { User } from "~~/models/user";
import { getAllUsers, saveUser } from "~~/services/mongo/mongo";

export async function SignUp(user: User) {
  const {
    serverRuntimeConfig: { providerConfig: providerConfig },
  } = getConfig();
  const ethrResolver = ethr.getResolver(providerConfig);
  const resolver = new Resolver(ethrResolver);

  const did = parse(user.id);
  const doc = await resolver.resolve(user.id);
  if (doc.didResolutionMetadata.error || did === null) {
    throw Error(`Invalid user id: ${user.id}.`);
  }
  user.address = did.id;

  try {
    await saveUser(user);
    return `user ${user.address} ${user.name} joined.`;
  } catch (err) {
    if (err instanceof DuplicateUserError) {
      throw new Error(`User ${user.id} already exists.`);
    } else {
      throw new Error(`Internal server error: ${err}.`);
    }
  }
}

export async function GET() {
  try {
    return await getAllUsers();
  } catch (err) {
    console.log("get all users error: ", err);
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw new Error(`internal server error.`);
  }
}
