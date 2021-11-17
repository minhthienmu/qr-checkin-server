import { Router } from "express";
import controllerAccomodation from "../controllers/accomodation";
import controllerUser from "../controllers/user";

const router = Router();

//User
router.post("/register", controllerUser.ValidateUser, controllerUser.Register);
router.post("/login", controllerUser.Login);
//router.post("/logout", controllerUser.Logout);

//Accomodation
router.get("/get-accomodations", controllerAccomodation.getAccomodations);
router.post("/create-accomodation", controllerUser.CheckAuth, controllerAccomodation.createAccomodation);
router.get("/get-accomodation-detail", controllerAccomodation.getAccomodationsDetail);
router.post("/delete-accomodation", controllerUser.CheckAuth, controllerAccomodation.deleteAccommodation);
router.post("/update-accomodation", controllerUser.CheckAuth, controllerAccomodation.updateAccomodation);
router.post("/filter-accomodation", controllerAccomodation.filterAccomodation);

//Workspace

export = router
