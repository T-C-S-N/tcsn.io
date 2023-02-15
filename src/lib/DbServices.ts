/** @format */

require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI || "mongodb://mongo:27017/" + process.env.MONGODB_DATABASE;
;
const dbName = process.env.MONGODB_DATABASE;

const DbServices = {
  // check if connection is working
  ping: async () => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const r = await d.command({ ping: 1 });
      return r.ok === 1;
    } finally {
      await client.close();
    }
  },
};

export default DbServices;
