const Brand = require("../models/brand");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createBrand = (req, res) => {
  //res.status(200).json( { file: req.files, body: req.body } );

  const { name, description, createdBy } = req.body;
  // let productPictures = [];

  // if (req.files.length > 0) {
  //   productPictures = req.files.map((file) => {
  //     return { img: file.location };
  //   });
  // }

  const Brands = new Brand({
    name: name,
    slug: slugify(name),
    description,
    // productPictures,
    createdBy: req.user._id,
  });

  Brands.save((error, brand) => {
    if (error) return res.status(400).json({ error });
    if (brand) {
      res.status(201).json({ brand, files: req.files });
    }
  });
};
exports.getBrandBySlug = (req, res) => {
  const { slug } = req.params;
  if (slug) {
    Brand.find({ slug: { $regex: ".*" + slug + ".*" } }).exec(
      (error, brand) => {
        if (error) return res.status(400).json({ error });
        if (brand) {
          res.status(200).json({ brand });
        }
      }
    );
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.getBrandDetailsById = (req, res) => {
  const { brandId } = req.params;
  if (brandId) {
    Brand.findOne({ _id: brandId }).exec((error, brand) => {
      if (error) return res.status(400).json({ error });
      if (brand) {
        res.status(200).json({ brand });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteBrandById = (req, res) => {
  const { brandId } = req.body.payload;

  if (brandId) {
    Brand.deleteOne({ _id: brandId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Brand.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
