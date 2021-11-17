import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Accomodation from "../models/accomodation";

const createAccomodation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { name, address, price, category, image, description, vendor, vendorName } = req.body;
  const image_0 = image[0] ? image[0] : "";
  const image_1 = image[1] ? image[0] : "";
  const image_2 = image[2] ? image[0] : "";

  const accomodation = new Accomodation({
    _id: new mongoose.Types.ObjectId(),
    name,
    address,
    price,
    category,
    image: image_0,
    image_1,
    image_2,
    description,
    vendor,
    vendorName,
  });

  return accomodation
    .save()
    .then(() => {
      return res.status(200).json({code: 200, data: accomodation.id});
    })
    .catch((error: Error) => {
      return res.status(500).json({data: error.message, error});
    });
};

const getAccomodations = (req: Request, res: Response, next: NextFunction) => {
  const vendor = req.query.vendor;
  let param = {};
  if (vendor) {
    param = {vendor: vendor};
  }
  Accomodation.find(param)
    .exec()
    .then((accomodation) => {
      return res.status(200).json({code: 200, data: accomodation});
    })
    .catch((error) => {
      return res.status(500).json({data: error.message, error});
    });
};

const getAccomodationsDetail = (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  Accomodation.findById(id)
    .exec((err, item) => {
      if (err || !item) {
        return res.status(500).json({code: 500, data: "Error!"});
      }
      return res.status(200).json({code: 200, data: item});
    })
};

const updateAccomodation = (req: Request, res: Response, next: NextFunction) => {
  const id = req.body.id;
  Accomodation.findOneAndUpdate({"_id": id}, req.body)
    .then((item) => {
      if (item) {
        return res.status(200).json({
          code: 200,
          data: "Success",
        });
      } else {
        return res.status(500).json({
          code: 500,
          data: "Not found",
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        data: error.message,
        error,
      });
    })
}

const deleteAccommodation = (req: Request, res: Response, next: NextFunction) => {
  const id = req.body.id;
  Accomodation.findByIdAndDelete(id)
    .exec()
    .then((item) => {
      if (item) {
        return res.status(200).json({ code: 200, data: "success" });
      }
      return res.json({ code: 500, data: "Not found" });
    })
    .catch((error) => {
      return res.status(500).json({ data: error.message, error });
    });
};

const filterAccomodation = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ code: 200, data: "success" });
};

export default {
  createAccomodation,
  getAccomodations,
  getAccomodationsDetail,
  deleteAccommodation,
  updateAccomodation,
  filterAccomodation
};
