const express = require("express");
const { requireSignin, adminMiddleware } = require("../../common-middleware");

const {
  create,
  getBySlug,
  getByID,
  deleteByID,
  selectAll,
} = require("../../controller/admin/itemType");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

router.post("/itemType/create", requireSignin, adminMiddleware, create);
router.get("/itemType/:slug", getBySlug);
//router.get('/category/getcategory', getCategories);
router.get("/itemType/:id", getByID);
router.delete("/itemType/delete", requireSignin, adminMiddleware, deleteByID);
router.post("/itemType/getall", requireSignin, adminMiddleware, selectAll);

module.exports = router;
