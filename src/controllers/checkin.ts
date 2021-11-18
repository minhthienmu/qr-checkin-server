import { qrCodeCache } from './../../index';
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Workspace from "../models/workspace";
import WorkspaceSetting from "../models/workspace_setting";
import User from "../models/user";

const validateCheckin = async (req: Request, res: Response, next: NextFunction) => {
    const { workspace_id, user_id, qrCode, location  } = req.body;
    
    try {
        console.log(workspace_id);
        console.log(user_id);
        console.log(qrCode);
        console.log(location);
        console.log("qrCodeCache", qrCodeCache);

        
  
        return res.status(200).json({data: "Success"});
    } catch (error: any) {
        return res.status(500).json({data: error.message, error});
    };
};

export default {
    validateCheckin
};