/** @format */

require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI || "mongodb://mongo:27017/" + process.env.MONGODB_DATABASE;
;
const dbName = process.env.MONGODB_DATABASE;
const productsCollectionName = "products";

const ProductServices = {
  getAllProducts: async () => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(productsCollectionName);
      const r = await c.find({}).toArray();
      return r;
    } finally {
      await client.close();
    }
  },
  getProductById: async (id: string) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(productsCollectionName);
      const filter = { _id: new ObjectId(id) };
      const r = await c.findOne(filter);
      return r;
    } finally {
      await client.close();
    }
  },
  createProduct: async (data: any) => {
    if (data) {
      if (data._id) delete data._id;
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();

      const client = new MongoClient(uri);
      try {
        const d = client.db(dbName);
        const c = d.collection(productsCollectionName);
        const r = await c.insertOne(data);
        console.log(`A product was inserted with the _id: ${r.insertedId}`);
        return r;
      } finally {
        await client.close();
      }
    }
  },
  updateProductById: async (id: string, data: any) => {
    if (data) {
      if (data && data._id) delete data._id;
      data.updatedAt = new Date().toISOString();

      const client = new MongoClient(uri);
      try {
        const d = client.db(dbName);
        const c = d.collection(productsCollectionName);
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
  deleteProductById: async (id: string) => {
    const client = new MongoClient(uri);
    try {
      const d = client.db(dbName);
      const c = d.collection(productsCollectionName);
      const filter = { _id: new ObjectId(id) };
      let r = await c.deleteOne(filter).catch((e: any) => console.log(e));
      return r;
    } finally {
      await client.close();
    }
  },
};

export default ProductServices;
