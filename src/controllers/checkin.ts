import { qrCodeStrCache } from './../../index';
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Workspace from "../models/workspace";
import WorkspaceSetting from "../models/workspace_setting";
import History from "../models/history";
import User from "../models/user";

const validateCheckin = async (req: Request, res: Response, next: NextFunction) => {
    const { workspace_id, user_id, qrCode, location  } = req.body;
    
    try {
        if (qrCode !== qrCodeStrCache) {
            return res.status(500).json({data: "Invalid QRCode"});
        }

        //TODO: if Location => validateLocation;
        if (!!!validateLocation()) {
            return res.status(500).json({data: "Validate Location Fail"});
        }

        const history = await History.findOne({user_id: user_id});
        if (history) {
            const workspace = history.workspaces.find((item: any) => item.workspace_id == workspace_id);
            if (workspace) { 
                workspace.history.push(new Date());
            } else {
                history.workspaces.push({
                    workspace_id: workspace_id,
                    history: [
                        new Date()
                    ]
                });
            }
            history.save();
        } else {
            const newHistory = new History({
                _id: new mongoose.Types.ObjectId(),
                user_id: user_id,
                workspaces: [{
                    workspace_id: workspace_id,
                    history: [
                        new Date()
                    ]
                }]
            });
            await newHistory.save();
        }
  
        return res.status(200).json({data: "Success"});
    } catch (error: any) {
        return res.status(500).json({data: error.message, error});
    };
};

const validateLocation = async () => {
    return true;
} 

export default {
    validateCheckin
};