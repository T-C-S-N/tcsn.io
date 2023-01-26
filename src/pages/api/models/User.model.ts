import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
   name: String,
   email: String,
   password: String,
   phone: Number,
   isActive: Boolean
});

export default mongoose.model("UserModel", UserModelSchema);
