import mongoose, { Schema } from "mongoose";

const HistorySchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    workspaces: [{
        workspace_id: { type: Schema.Types.ObjectId, ref: "Workspace" },
        history: [{ type: Date }],
    }]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>("History", HistorySchema);
