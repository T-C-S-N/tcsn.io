require("dotenv").config();

if (!process.env.SECRET) console.error("Error: SECRET is missing");
if (!process.env.WEBSITE_URL) console.error("Error: WEBSITE_URL is missing");
if (!process.env.API_URL) console.error("Error: API_URL is missing");
if (!process.env.NEXTAUTH_URL) console.error("Error: NEXTAUTH_URL is missing");
if (!process.env.MONGO_USERS_COLLECTION) console.error("Error: MONGO_USERS_COLLECTION is missing");
if (!process.env.MONGO_PROJECTS_COLLECTION) console.error("Error: MONGO_PROJECTS_COLLECTION is missing");
if (!process.env.MONGO_MEMOS_COLLECTION) console.error("Error: MONGO_MEMOS_COLLECTION is missing");
if (!process.env.DROPBOX_APP_KEY) console.error("Error: DROPBOX_APP_KEY is missing");
if (!process.env.DROPBOX_APP_SECRET) console.error("Error: DROPBOX_APP_SECRET is missing");
if (!process.env.DROPBOX_APP_TOKEN) console.error("Error: DROPBOX_APP_TOKEN is missing");
if (!process.env.GOOGLE_ANALYTICS_PUBLIC) console.error("Error: GOOGLE_ANALYTICS_PUBLIC is missing");
if (!process.env.EMAIL_HOST) console.error("Error: EMAIL_HOST is missing");
if (!process.env.EMAIL_PORT) console.error("Error: EMAIL_PORT is missing");
if (!process.env.EMAIL_USER) console.error("Error: EMAIL_USER is missing");
if (!process.env.EMAIL_PASSWORD) console.error("Error: EMAIL_PASSWORD is missing");
if (!process.env.EMAIL_WEBSITE_NAME) console.error("Error: EMAIL_WEBSITE_NAME is missing");
if (!process.env.EMAIL_WEBSITE_URL) console.error("Error: EMAIL_WEBSITE_URL is missing");
if (!process.env.EMAIL_LOGO_IMAGE) console.error("Error: EMAIL_LOGO_IMAGE is missing");

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