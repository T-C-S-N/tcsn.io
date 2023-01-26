
require('dotenv').config();
import { MongoClient } from 'mongodb'
const bcrypt = require('bcrypt');

if (!process.env.MONGODB_URI) {
   throw new Error('Invalid environment variable: "MONGODB_URI"')
}

/*
mongoose.connection.db.listCollections().toArray(function (err, names) {
   console.log(names); // [{ name: 'dbname.myCollection' }]
});

async function run() {
   await connect(process.env.MONGODB_URI as string, {});
   console.log("Connected to MongoDB");
}
run().catch(err => console.log(err));
*/

const UserServices = {
   // create user
   createUser: async (firstName: string, lastName: string, email: string, password: string) => {
      try {
         // hash password
         const salt = await bcrypt.genSalt(10);
         const hash = await bcrypt.hash(password, salt);
         password = hash;

         /*
         const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
         });
         return user;
         */
      }
      catch (err) {
         console.error("Failed to create user. Error", err);
         return false;
      }
   },

   // update user
   updateUser: async (userId: string, firstName: string, lastName: string, email: string, password: string) => {
      try {
         /*
         const user = await User.updateOne({ _id: userId }, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
         });
         return user;
         */
      }
      catch (err) {
         console.error("Failed to update user. Error", err);
         return false;
      }
   },

   // delete user
   deleteUser: async (userId: string) => {
      try {
         /*
         const user = await User.deleteOne({ _id: userId });
         return user;
         */
      }
      catch (err) {
         console.error("Failed to delete user. Error", err);
         return false;
      }
   },

   // get all users
   getUsers: async () => {
      console.log(3333)
      try {
         /*
         const users = await User.find({});
         console.log(users);
         return users;
         */
      }
      catch (err) {
         console.error("Failed to get users. Error", err);
         return false;
      }
   },

   // get user by email
   getUserByEmail: async (email: string) => {
      try {
         /*
         const user = await User.findOne({ email: email });
         return user;
         */
      }
      catch (err) {
         console.error("Failed to get user. Error", err);
         return false;
      }
   },

   // get user by id
   getUser: async (userId: string) => {
      try {
         /*
         const user = await User.findOne({ _id: userId });
         return user;
         */
      }
      catch (err) {
         console.error("Failed to get user. Error", err);
         return false;
      }
   },

   // check if user exists
   checkUser: async (email: string) => {
      try {
         /*
         const user: any = await User.findOne({
            email: email
         });
         if (user) {
            return true;
         }
         else {
            return false;
         }
         */
      }
      catch (err) {
         console.error("Failed to check user. Error", err);
         return false;
      }
   },

   // check password using bcrypt
   checkPassword: async (userId: string, password: string) => {
      try {
         /*
         const user: any = await User.findOne({ _id: userId });
         if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            return isMatch;
         }
         else {
            return false;
         }
         */
      }
      catch (err) {
         console.error("Failed to check password. Error", err);
         return false;
      }
   }
};

export default UserServices;
