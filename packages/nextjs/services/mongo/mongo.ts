import getConfig from "next/config";
import { User } from "../../models/user";
import { InsertOneResult, MongoClient } from "mongodb";

const { serverRuntimeConfig } = getConfig();
const mongoConfig = serverRuntimeConfig.mongoConfig;
const client = new MongoClient(mongoConfig.connectionStr);
const usersCollection = client.db(mongoConfig.DB!).collection<User>("User");

//function to connect to mongoDB and save a user to the database
export async function saveUser(user: User): Promise<InsertOneResult> {
  return usersCollection.insertOne(user);
}

//function to connect to mongoDB and get a user from the database
export async function getUserByAddress(address: string) {
  try {
    return usersCollection.findOne({ address: address });
  } catch (error) {
    console.error(error);
    return error;
  }
}

//function to get user by _id
export async function getUserById(id: string) {
  try {
    return usersCollection.findOne({ id: id });
  } catch (error) {
    console.error(error);
    return error;
  }
}

//function to list all users
export async function getAllUsers() {
  try {
    const usersCursor = usersCollection.find();
    const usersArray = await usersCursor.toArray();
    return usersArray;
  } catch (error) {
    throw new Error("Error retrieving users from the database");
  }
}
