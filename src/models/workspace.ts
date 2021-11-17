import mongoose, { Schema } from "mongoose";

const WorkspaceSchema: Schema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    address: { type: String, require: true },
    email: { type: String },
    company_name: { type: String, require: true },
    setting: { type: Schema.Types.ObjectId, ref: "WorkspaceSetting" },
    participants: [{ type: Schema.Types.ObjectId, ref: "Participant" }],
    isActive: { type: Boolean, require: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>("Workspace", WorkspaceSchema);
