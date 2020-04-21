const Hotel = require("../models/hotel");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.gethotelById = (req, res, next, id) => {
  Hotel.findById(id)
    .populate("category")
    .exec((err, hotel) => {
      if (err) {
        return res.status(400).json({
          error: "Hotel not found"
        });
      }
      req.hotel = hotel;
      next();
    });
};

exports.createhotel = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
    //destructure the fields
    const { name, description, price, category, roomsAvailable } = fields;

    if (!name || !description || !price || !category || !roomsAvailable) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }

    let hotel = new Hotel(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      hotel.photo.data = fs.readFileSync(file.photo.path);
      hotel.photo.contentType = file.photo.type;
    }
    // console.log(hotel);

    //save to the DB
    hotel.save((err, hotel) => {
      if (err) {
        res.status(400).json({
          error: "Saving hotel in DB failed"
        });
      }
      res.json(hotel);
    });
  });
};

exports.gethotel = (req, res) => {
  req.hotel.photo = undefined;
  return res.json(req.hotel);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.hotel.photo.data) {
    res.set("Content-Type", req.hotel.photo.contentType);
    return res.send(req.hotel.photo.data);
  }
  next();
};

// delete controllers
exports.deletehotel = (req, res) => {
  let hotel = req.hotel;
  hotel.remove((err, deletedhotel) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the hotel"
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedhotel
    });
  });
};

// delete controllers
exports.updatehotel = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    let hotel = req.hotel;
    hotel = _.extend(hotel, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      hotel.photo.data = fs.readFileSync(file.photo.path);
      hotel.photo.contentType = file.photo.type;
    }
    // console.log(hotel);

    //save to the DB
    hotel.save((err, hotel) => {
      if (err) {
        res.status(400).json({
          error: "Updation of hotel failed"
        });
      }
      res.json(hotel);
    });
  });
};

//hotel listing
exports.getAllhotels = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Hotel.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,hotels)=>{
        if(err){
            return res.status(400).json({
                error: "No product Found"
            });
        }
        res.json(hotels);
    });
}

exports.updatehotel = (req,res,next)=>{
    let myOperations = req.body.order.hotels.map(prod => {
        return {
            updateOne:{
                filter: {_id:prod._id},
                update: {$inc: {roomsAvailable:-prod.count,roomsbooked:+prod.count}}
            }
        };
    });
    Hotel.bulkWrite(myOperations, {}, (err,hotels)=>{
        if(err){
            return res.status(400).json({
                error: "Bulk operations failed"
            });
        }
        next();
    });
};

exports.getAllUniqueCategories = (req,res)=>{
    Hotel.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error: "No category found"
            });
        }
        res.json(category);
    });
};
