import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Workspace from "../models/workspace";
import WorkspaceSetting from "../models/workspace_setting";
import User from "../models/user";

const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    const { host, name  } = req.body;
  
    try {
      const workspace = new Workspace({
        _id: new mongoose.Types.ObjectId(),
        host: host,
        name: name
      });
      await workspace.save();
      const user = await User.findById(host);
      if (user) {
        user.host_workspace.push(workspace.id);
        user.save();
      }
  
      return res.status(200).json({data: workspace.id});
    } catch (error: any) {
      return res.status(500).json({data: error.message, error});
    };
};

const configurateWorkspace = (req: Request, res: Response, next: NextFunction) => {
  const { id, company_name, email, address, checkinMode, location, time } = req.body;
  
  const updateWorkspace = {
    company_name, email, address
  }

  Workspace.findByIdAndUpdate(id, updateWorkspace)
  .then((item) => {
    if (item) {
      const workspaceSetting = new WorkspaceSetting({
        _id: new mongoose.Types.ObjectId(),
        workspace_id: id, 
        checkinMode, 
        location,
        time
      });

      return workspaceSetting
        .save()
        .then(() => {
          return res.status(200).json({ data: "Success" });
        })
        .catch((error: Error) => {
          return res.status(500).json({ data: error.message, error });
        });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  })
  .catch((error) => {
    return res.status(500).json({ data: error.message, error });
  });
};

const addParticipant = async (req: Request, res: Response, next: NextFunction) => {
  const { id, participants } = req.body;

  try {
    const workspace = await Workspace.findById(id);
    if (workspace) {
      for (let i = 0; i < participants.length; i++) {
        let user = await User.findOne({ username: participants[i] });
        if (user && !workspace.participants.includes(user._id)) {
          workspace.participants.push(user._id);
          user.par_workspace.push(workspace._id);
          user.save();
        }
      }
      workspace.save();
      return res.status(200).json({ data: "Success" });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const getWorkspaces = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  try {
    const data: any = {
      host_workspace: [],
      par_workspace: []
    };

    const user = await User.findById(id);
    if (user) {
      const host_workspace = user.host_workspace;
      for (let i = 0; i < host_workspace.length; i++) {
        let workspace = await Workspace.findById(host_workspace[i]._id);
        if (workspace) {
          const item = {
            id: workspace._id,
            name: workspace.name
          }
          data.host_workspace.push(item);
        }
      }

      const par_workspace = user.par_workspace;
      for (let i = 0; i < par_workspace.length; i++) {
        let workspace = await Workspace.findById(par_workspace[i]._id);
        if (workspace) {
          const item = {
            id: workspace._id,
            name: workspace.name
          }
          data.par_workspace.push(item);
        }
      }

      return res.status(200).json({ data: data });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
} 




export default {
  createWorkspace,
  configurateWorkspace,
  addParticipant,
  getWorkspaces
};