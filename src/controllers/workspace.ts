import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Workspace from "../models/workspace";
import WorkspaceSetting from "../models/workspace_setting";
import History from "../models/history";
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
      let successUsers: any = [];
      let failUsers: any = [];
      for (let i = 0; i < participants.length; i++) {
        let user = await User.findOne({ username: participants[i] });
        if (user && !workspace.participants.includes(user._id)) {
          workspace.participants.push(user._id);
          successUsers.push(participants[i]);
          user.par_workspace.push(workspace._id);
          console.log(user);
          user.save();
        } else {
          failUsers.push(participants[i]);
        }
      }
      workspace.save();
      return res.status(200).json({
        data: {
          successUsers: successUsers,
          failUsers: failUsers,
        },
      });
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

const updateWorkspaceConfig = async (req: Request, res: Response, next: NextFunction) => {
  const { workspace_id, config } = req.body;

  try {
    const workspaceSetting = await WorkspaceSetting.findOneAndUpdate({workspace_id: workspace_id}, config);
    if (workspaceSetting) {
      return res.status(200).json({ data: "Success" });
    }
    return res.status(500).json({ data: "Not found" });
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const updateWorkspaceInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { workspace_id, company_name, email, address } = req.body;

  const updateWorkspace = {
    company_name, email, address
  }

  try {
    let workspace = await Workspace.findByIdAndUpdate(workspace_id, updateWorkspace);
    if (workspace) {
      return res.status(200).json({ data: "Success" });
    }
    return res.status(500).json({ data: "Not found" });
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const getWorkspaceModule = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, workspace_id } = req.body;

  try {
    const workspace = await Workspace.findById(workspace_id).select("host");
    if (workspace) {
      let data: any[] = [];
      if (workspace.host.toHexString() === user_id) {
        data = [
          { id: 1, name: "Employee", description: "Employee List" },
        ];
      } else {
        data = [
          { id: 1, name: "History", description: "History Checkin/Checkout" },
        ];
      }
      return res.status(200).json({ data: data });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const checkHost = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, workspace_id } = req.body;

  try {
    const workspace = await Workspace.findById(workspace_id).select("host");
    if (workspace) {
      let data: any = {};
      if (workspace.host.toHexString() === user_id) {
        data = { isHost: true };
      } else {
        data = { isHost: false };
      }
      return res.status(200).json({ data: data });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const getWorkspaceTime = async (req: Request, res: Response, next: NextFunction) => {
  const { workspace_id } = req.body;

  try {
    const setting = await WorkspaceSetting.findOne({workspace_id: workspace_id}).select("time");
    if (setting) {
      return res.status(200).json({ data: setting.time });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const getWorkspaceLocation = async (req: Request, res: Response, next: NextFunction) => {
  const { workspace_id } = req.body;

  try {
    const setting = await WorkspaceSetting.findOne({workspace_id: workspace_id}).select("location");
    if (setting) {
      return res.status(200).json({ data: setting.location });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const getWorkspaceMode = async (req: Request, res: Response, next: NextFunction) => {
  const { workspace_id } = req.body;

  try {
    const setting = await WorkspaceSetting.findOne({workspace_id: workspace_id}).select("checkinMode");
    if (setting) {
      return res.status(200).json({ data: setting.checkinMode });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
  const { workspace_id } = req.body;

  try {
    const workspace = await Workspace.findById(workspace_id).select("participants");
    if (workspace) {
      const participantIds = workspace.participants;
      let participants: any = [];
      for(let i = 0; i < participantIds.length; i++) {
        let user = await User.findById(participantIds[i]).select("username");
        if (user) {
          participants.push(user);
        }
      }
      return res.status(200).json({ data: participants });
    } else {
      return res.status(500).json({ data: "Not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ data: error.message, error });
  }
}

const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, workspace_id, month, year } = req.body;

  try {
    const userHistory = await History.findOne({user_id: user_id});
    if (userHistory) {
      const workspaceHistory = userHistory.workspaces.find((item: any) => item.workspace_id == workspace_id);
      if (!workspaceHistory) {
        return res.status(500).json({ data: "Not found" });
      }
      const history = workspaceHistory.history;
      const dataFilter = history.filter((item: any) => item.getMonth() + 1 == month && item.getFullYear() == year);
      const data: any[] = [];
      for (let i = 1; i < 32; i++) {
        let dates = dataFilter.filter((item: any) => item.getDate() == i);
        if (dates.length) {
          data.push({
            date: dates[0],
            checkin: dates[0],
            checkout: dates[dates.length - 1]
          });
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
  getWorkspaces,
  updateWorkspaceConfig,
  getWorkspaceModule,
  updateWorkspaceInfo,
  checkHost,
  getWorkspaceTime,
  getWorkspaceLocation,
  getWorkspaceMode,
  getEmployees,
  getHistory
};