import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const access_token_secret =
  "c7ee923a448307b4d03f86721244f7f7439de25b68f47d59121a05d004495eb48ee5bacf89fd881157bbdc06d7db57dbb2066b0ab059c679969bc843205fb6df";

const ValidateUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.username && req.body.password) {
    User.findOne({username: req.body.username})
    .exec((err, user) => {
        if (err) {
            return res.status(500).json({ data: err });
        }
        if (user) {
            return res.status(400).json({data: "Failed! Username is already in use!" });
        }
        next();
    });
  } else {
    return res.status(500).json({ data: "Error" });
  }
};

const Register = (req: Request, res: Response, next: NextFunction) => {
    const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    
    return user
        .save()
        .then(() => {
            res.status(200).send({code: 200, data: "Success"});
        })
}

const Login = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.username && req.body.password) {
        User.findOne({username: req.body.username})
        .exec((err, user) => {
            if (err) {
                return res.status(500).send({ data: err });
            }
            if (!user) {
                return res.status(401).send({data: "Not Found!" });
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({data: "Invalid Password!"});
            }
            const accessToken = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN_SECRET || access_token_secret,
                {
                    expiresIn: 86400
                }
              );
            return res.status(200).send({
                data: {
                  id: user._id,
                  username: user.username,
                  role: user.role,
                  token: accessToken
                }
              });
        });
    } else {
        return res.status(500).send({ data: "Error" });
    }
}

const CheckAuth = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader;
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || access_token_secret,
      (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      }
    );
  };

export default { ValidateUser, Register, Login, CheckAuth };
