import { Router } from "express";
import controllerUser from "../controllers/user";
import controllerWorkspace from "../controllers/workspace";
import controllerCheckin from "../controllers/checkin";

const router = Router();

//User
router.post("/register", controllerUser.ValidateUser, controllerUser.Register);
router.post("/login", controllerUser.Login);
//router.post("/logout", controllerUser.Logout);

//Workspace
router.post("/create-workspace", controllerUser.CheckAuth, controllerWorkspace.createWorkspace);
router.post("/configurate-workspace", controllerUser.CheckAuth, controllerWorkspace.configurateWorkspace);
router.post("/add-participant", controllerUser.CheckAuth, controllerWorkspace.addParticipant);
router.post("/get-workspaces", controllerUser.CheckAuth, controllerWorkspace.getWorkspaces);
router.post("/update-workspace-config", controllerUser.CheckAuth, controllerWorkspace.updateWorkspaceConfig);
router.post("/get-workspace-module", controllerUser.CheckAuth, controllerWorkspace.getWorkspaceModule);
router.post("/update-workspace-info", controllerUser.CheckAuth, controllerWorkspace.updateWorkspaceInfo);
router.post("/check-host", controllerUser.CheckAuth, controllerWorkspace.checkHost);
router.post("/get-workspace-time", controllerUser.CheckAuth, controllerWorkspace.getWorkspaceTime);
router.post("/get-workspace-location", controllerUser.CheckAuth, controllerWorkspace.getWorkspaceLocation);
router.post("/get-workspace-mode", controllerUser.CheckAuth, controllerWorkspace.getWorkspaceMode);
router.post("/get-employees", controllerWorkspace.getEmployees);
router.post("/get-history", controllerWorkspace.getHistory);


//Checkin
router.post("/validate-checkin", controllerCheckin.validateCheckin);


export = router
