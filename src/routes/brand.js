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

  getBrands,
} = require("../controller/brand");

const router = express.Router();
const shortid = require("shortid");
const path = require("path");

router.post("/brand/create", requireSignin, adminMiddleware, createBrand);
router.get("/brands/:slug", getBrandBySlug);

router.get("/brand/:brandId", getBrandDetailsById);
router.delete(
  "/brand/deleteBrandById",
  requireSignin,
  adminMiddleware,
  deleteBrandById
);
router.post("/brand/getBrands", requireSignin, adminMiddleware, getBrands);

module.exports = router;
