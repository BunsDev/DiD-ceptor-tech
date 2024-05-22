import getConfig from "next/config";
import { User } from "../../models/user";
import { saveUser } from "../../services/mongo/mongo";
import { Resolver, parse } from "did-resolver";
import ethr from "ethr-did-resolver";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === "POST") {
    const { serverRuntimeConfig } = getConfig();
    const ethrResolver = ethr.getResolver(serverRuntimeConfig.providerConfig);
    const resolver = new Resolver(ethrResolver);

    const user: User = req.body;
    const did = parse(user.id);
    const doc = await resolver.resolve(user.id);
    if (doc.didResolutionMetadata.error || did === null) {
      res.status(400).json({ message: `invalid user id: ${user.id}.` });
    } else {
      user.address = did.id;
      await saveUser(user);
      res.status(200).json({ message: `user ${user.address} ${user.name} joined.` });
    }
  } else {
    res.status(404);
  }
}
