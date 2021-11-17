import mongoose, { Schema } from "mongoose";

const WorkspaceSettingSchema: Schema = new Schema(
  {
    workspace_id: { type: Schema.Types.ObjectId, ref: "Workspace" },
    checkinMode: { 
        qrCode: { type: Boolean },
        location: { type: Boolean },
    },
    location: {
        longitude: String,
        latitude: String,
        radius: Number,
    },
    time: {
        monday: {
            isActive: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        tuesday: {
            isActive: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        wednesday: {
            isActive: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        thursday: {
            isActive: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        friday: {
            isActive: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        saturday: {
            isActive: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        sunday: {
            isActive: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>("WorkspaceSetting", WorkspaceSettingSchema);
