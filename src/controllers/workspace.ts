import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Workspace from "../models/workspace";

const createWorkspace = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let body = req.body;
    
    const workspace = new Workspace({
        _id: new mongoose.Types.ObjectId(),
    });
  
    return workspace
      .save()
      .then(() => {
        return res.status(200).json({data: workspace.id});
      })
      .catch((error: Error) => {
        return res.status(500).json({data: error.message, error});
      });
  };