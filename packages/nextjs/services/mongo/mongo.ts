import { DuplicateUserError } from "../../models/errors";
import { User } from "../../models/user";
import { InsertOneResult, MongoClient, MongoServerError, WithId } from "mongodb";

if (!process.env.MONGO_CONN_STR) {
  throw new Error("MONGO_CONN_STR is missing, please check your env file");
}

if (!process.env.MONGO_DB) {
  throw new Error("MONGO_DB is missing, please check your env file");
}

const client = new MongoClient(process.env.MONGO_CONN_STR);
const usersCollection = client.db(process.env.MONGO_DB).collection<User>("User");

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
