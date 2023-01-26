
require("dotenv").config();

if (!process.env.SECRET) console.error("SECRET is missing");
if (!process.env.WEBSITE_URL) console.error("WEBSITE_URL is missing");
if (!process.env.API_URL) console.error("API_URL is missing");
if (!process.env.NEXTAUTH_URL) console.error("NEXTAUTH_URL is missing");
if (!process.env.MONGO_USERS_COLLECTION) console.error("MONGO_USERS_COLLECTION is missing");
if (!process.env.MONGO_PROJECTS_COLLECTION) console.error("MONGO_PROJECTS_COLLECTION is missing");
if (!process.env.MONGO_MEMOS_COLLECTION) console.error("MONGO_MEMOS_COLLECTION is missing");
if (!process.env.DROPBOX_APP_KEY) console.error("DROPBOX_APP_KEY is missing");
if (!process.env.DROPBOX_APP_SECRET) console.error("DROPBOX_APP_SECRET is missing");
if (!process.env.DROPBOX_APP_TOKEN) console.error("DROPBOX_APP_TOKEN is missing");
if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) console.error("NEXT_PUBLIC_GOOGLE_ANALYTICS is missing");
if (!process.env.EMAIL_HOST) console.error("EMAIL_HOST is missing");
if (!process.env.EMAIL_PORT) console.error("EMAIL_PORT is missing");
if (!process.env.EMAIL_USER) console.error("EMAIL_USER is missing");
if (!process.env.EMAIL_PASSWORD) console.error("EMAIL_PASSWORD is missing");
if (!process.env.EMAIL_WEBSITE_NAME) console.error("EMAIL_WEBSITE_NAME is missing");
if (!process.env.EMAIL_WEBSITE_URL) console.error("EMAIL_WEBSITE_URL is missing");
if (!process.env.EMAIL_LOGO_IMAGE) console.error("EMAIL_LOGO_IMAGE is missing");

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const options = {}

let client
let clientPromise: Promise<MongoClient>

client = new MongoClient(uri, options)
clientPromise = client.connect()

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise