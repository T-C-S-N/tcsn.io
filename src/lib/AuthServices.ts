/** @format */

require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI || "mongodb://mongo:27017/" + process.env.MONGODB_DATABASE;
const dbName = process.env.MONGODB_DATABASE;
const usersCollectionName = "users";

const AuthServices = {
  // check authorization from header
  checkHeaderAuthorization: async (authorization: any) => {
    if (!authorization) return false;
    const auth = JSON.parse(authorization);
    // check if auth contains email and accessToken
    if (!auth.email || !auth.accessToken) return false;

    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { email: auth.email, accessToken: auth.accessToken };
      const r = await c.findOne(filter);
      return r !== null;
    } finally {
      await client.close();
    }
  },

  checkIsUser: async (authorization: any) => {
    if (!authorization) return false;
    const auth = JSON.parse(authorization);
    // check if auth contains email and accessToken
    if (!auth.email || !auth.accessToken) return false;

    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { email: auth.email, accessToken: auth.accessToken };
      const r = await c.findOne(filter);
      return r !== null && r.role >= 0;
    } finally {
      await client.close();
    }
  },

  checkIsActiveUser: async (authorization: any) => {
    if (!authorization) return false;
    const auth = JSON.parse(authorization);
    // check if auth contains email and accessToken
    if (!auth.email || !auth.accessToken) return false;

    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { email: auth.email, accessToken: auth.accessToken };
      const r = await c.findOne(filter);
      return r !== null && r.role >= 1;
    } finally {
      await client.close();
    }
  },

  // check if user is admin
  checkIsAdmin: async (authorization: any) => {
    if (!authorization) return false;
    const auth = JSON.parse(authorization);
    // check if auth contains email and accessToken
    if (!auth.email || !auth.accessToken) return false;

    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(usersCollectionName);
      const filter = { email: auth.email, accessToken: auth.accessToken };
      const r = await c.findOne(filter);
      return r !== null && r.role >= 5;
    } finally {
      await client.close();
    }
  },
};

export default AuthServices;
