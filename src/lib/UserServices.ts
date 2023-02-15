/** @format */

require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI || "mongodb://mongo:27017/" + process.env.MONGODB_DATABASE;
;
const dbName = process.env.MONGODB_DATABASE;
const usersCollectionName = "users";

const UserServices = {
  // checkToken
  checkToken: async (email: string, accessToken: string) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { email: email, accessToken: accessToken };
      const r = await c.findOne(filter);
      return r !== null;
    } finally {
      await client.close();
    }
  },

  signup: async (userData: any) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      userData.role = 0;
      const filter = { email: userData.email };
      const r = await c.findOne(filter);
      if (r !== null) return new Error("User already exists");

      const ir = await c.insertOne(userData);
      console.log(`A user was inserted with the _id: ${ir.insertedId}`);

      const newUser = await c.findOne({ email: userData.email });
      if (!newUser) return new Error("User not created");
      return userData;
    } finally {
      await client.close();
    }
  },

  signin: async (email: string, password: string) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { email: email };
      const r = await c.findOne(filter);

      if (r !== null) {
        const user = r;
        const isValidPassword = user.validPassword(password);
        return isValidPassword ? user.generateToken() : null;
      }
      return null;
    } finally {
      await client.close();
    }
  },

  signout: async (email: string, accessToken: string) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { email: email, accessToken: accessToken };
      const r = await c.findOne(filter);
      if (r !== null) {
        const user = r;
        user.accessToken = null;
        const options = { upsert: true };
        const updateDoc = { $set: { accessToken: null } };
        const filter = { email: email };
        await c.updateOne(filter, updateDoc, options).catch((e: any) => console.log(e));
      }
      return null;
    } finally {
      await client.close();
    }
  },

  // users
  getAllUsers: async () => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const r = await c.find({}).toArray();
      return r;
    } finally {
      await client.close();
    }
  },
  getUserById: async (id: string) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { _id: new ObjectId(id) };
      const r = await c.findOne(filter);
      return r;
    } finally {
      await client.close();
    }
  },
  getUserByEmail: async (email: string) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { email: email };
      const r = await c.findOne(filter);
      return r;
    } finally {
      await client.close();
    }
  },
  createUser: async (data: any) => {
    if (data) {
      if (data._id) delete data._id;
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();

      const client = new MongoClient(uri);
      try {
        const d = client.db(dbName);
        const c = d.collection(usersCollectionName);
        const r = await c.insertOne(data);
        console.log(`A user was inserted with the _id: ${r.insertedId}`);
        return r;
      } finally {
        await client.close();
      }
    }
  },
  updateUserById: async (id: string, data: any) => {
    if (data) {
      if (data && data._id) delete data._id;
      data.updatedAt = new Date().toISOString();

      const client = new MongoClient(uri);
      try {
        const d = client.db(dbName);
        const c = d.collection(usersCollectionName);
        const options = { upsert: true };
        const updateDoc = { $set: data };
        const filter = { _id: new ObjectId(id) };
        await c.updateOne(filter, updateDoc, options).catch((e: any) => console.log(e));
        const updatedData = await c.findOne(filter);
         return updatedData;
      } finally {
        await client.close();
      }
    }
  },
  deleteUserById: async (id: string) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { _id: new ObjectId(id) };
      let r = await c.deleteOne(filter).catch((e: any) => console.log(e));
      return r;
    } finally {
      await client.close();
    }
  },
};

export default UserServices;
