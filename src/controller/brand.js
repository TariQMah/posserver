const Brand = require("../models/brand");

const slugify = require("slugify");

exports.createBrand = (req, res) => {
  console.log(
    "%cMyProject%cline:5%creq",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px",
    req
  );
  //res.status(200).json( { file: req.files, body: req.body } );

  const { name, description } = req.body;

  const brands = new Brand({
    name: name,
    slug: slugify(name),
    description,
    // productPictures,
    createdBy: req.user._id,
  });

  brands.save((error, brand) => {
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

exports.getBrands = async (req, res) => {
  const brands = await Brand.find({ createdBy: req.user._id })
    .select("_id name slug description")
    .exec();

  res.status(200).json({ brands });
};
