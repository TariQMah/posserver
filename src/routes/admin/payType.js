const express = require("express");
const { requireSignin, adminMiddleware } = require("../../common-middleware");

const {
  create,
  getBySlug,
  getByID,
  deleteByID,
  selectAll,
} = require("../../controller/admin/payType");
const router = express.Router();
router.post("/payType/create", requireSignin, adminMiddleware, create);
router.get("/payType/:slug", getBySlug);
router.get("/payType/:id", getByID);
router.delete("/payType/delete", requireSignin, adminMiddleware, deleteByID);
router.post("/payType/getall", requireSignin, adminMiddleware, selectAll);

module.exports = router;
