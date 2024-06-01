import getConfig from "next/config";
import { InsertOneResult, MongoClient, MongoServerError, WithId } from "mongodb";
import { DuplicateUserError } from "~~/models/errors";
import { User } from "~~/models/user";

const { serverRuntimeConfig } = getConfig();

if (!serverRuntimeConfig.mongoConfig.connectionStr) {
  throw new Error("mongo connection string is missing, please check MONGO_CONN_STR in your env file");
}

if (!serverRuntimeConfig.mongoConfig.db) {
  throw new Error("mongo db name is missing, please check MONGO_DB_NAME in your env file");
}

const client = new MongoClient(serverRuntimeConfig.mongoConfig.connectionStr);
const usersCollection = client.db(serverRuntimeConfig.mongoConfig.db).collection<User>("User");

//function to connect to mongoDB and save a user to the database
export async function saveUser(user: User): Promise<InsertOneResult<User>> {
  try {
    return await usersCollection.insertOne(user);
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new DuplicateUserError();
    }
    throw err;
  }
}

//function to connect to mongoDB and get a user from the database
export async function getUserByAddress(address: string): Promise<WithId<User> | null> {
  return await usersCollection.findOne({ address: address });
}

//function to get user by _id
export async function getUserById(id: string): Promise<WithId<User> | null> {
  return await usersCollection.findOne({ id: id });
}

//function to list all users
export async function getAllUsers(): Promise<WithId<User>[]> {
  const usersCursor = usersCollection.find();
  return await usersCursor.toArray();
}
