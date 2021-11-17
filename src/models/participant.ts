import mongoose, { Schema } from "mongoose";

const ParticipantSchema: Schema = new Schema(
  {
    role: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>("Participant", ParticipantSchema);
