const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  uploadS3,
} = require("../../common-middleware");

const {
  create,
  getByID,
  getBySlug,
  deleteByID,
  selectAll,
} = require("../../controller/admin/brand");
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
  create
);
router.get("/brands/:slug", getBySlug);
//router.get('/category/getcategory', getCategories);
router.get("/brand/:id", getByID);
router.delete(
  "/brand/deleteBrandById",
  requireSignin,
  adminMiddleware,
  deleteByID
);
router.post("/brand/getall", requireSignin, adminMiddleware, selectAll);

module.exports = router;
