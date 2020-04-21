const express = require("express");
const router = express.Router();

const {
  gethotelById,
  createhotel,
  gethotel,
  photo,
  updatehotel,
  deletehotel,
  getAllhotels,
  getAllUniqueCategories
} = require("../controllers/hotel");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("hotelId", gethotelById);

//all of actual routes
//create route
router.post(
  "/hotel/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createhotel
);

// read routes
router.get("/hotel/:hotelId", gethotel);
router.get("/hotel/photo/:hotelId", photo);

//delete route
router.delete(
  "/hotel/:hotelId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deletehotel
);

//update route
router.put(
  "/hotel/:hotelId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updatehotel
);

//listing route
router.get("/hotels",getAllhotels);

router.get("/hotels/categories",getAllUniqueCategories);

module.exports = router;
