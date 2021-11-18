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
router.post("/create-workspace", controllerWorkspace.createWorkspace);
router.post("/configurate-workspace", controllerWorkspace.configurateWorkspace);
router.post("/add-participant", controllerWorkspace.addParticipant);
router.post("/get-workspaces", controllerWorkspace.getWorkspaces);

//Checkin
router.post("/validate-checkin", controllerCheckin.validateCheckin);

export = router
