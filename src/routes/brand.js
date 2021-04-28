const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  uploadS3,
} = require("../common-middleware");

const {
  createBrand,
  getBrandBySlug,

  getBrandDetailsById,
  deleteBrandById,

  getProducts,
} = require("../controller/brand");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/brand/create",
  requireSignin,
  adminMiddleware,

  // uploadS3.array("productPicture"),
  createBrand
);
router.get("/brands/:slug", getBrandBySlug);
//router.get('/category/getcategory', getCategories);
router.get("/brand/:brandId", getBrandDetailsById);
router.delete(
  "/brand/deleteBrandById",
  requireSignin,
  adminMiddleware,
  deleteBrandById
);
router.post("/brand/getBrands", requireSignin, adminMiddleware, getProducts);

module.exports = router;
