import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>("User", UserSchema);
