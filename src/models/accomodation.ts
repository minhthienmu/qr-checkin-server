import mongoose, { Schema } from "mongoose";

const AccomodationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, require: true },
    rating: { type: Number },
    price: { type: Number, require: true },
    category: { type: String, require: true },
    description: { type: String },
    vendor: { type: Schema.Types.ObjectId, ref: 'User' },
    vendorName: { type: String },
    image: { type: String },
    image_1: { type: String }, 
    image_2: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>("Accomodation", AccomodationSchema);
