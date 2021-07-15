const Brand = require("../../models/brand");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../../models/category");

exports.create = (req, res) => {
  //res.status(200).json( { file: req.files, body: req.body } );

  const { name, id, description, createdBy } = req.body;
  // let productPictures = [];

  // if (req.files.length > 0) {
  //   productPictures = req.files.map((file) => {
  //     return { img: file.location };
  //   });
  // }
  Brand.findOne({ _id: id }).exec((error, brand) => {
    if (error) return res.status(400).json({ error });
    if (brand) {
      condition = { _id: id };
      update = {
        name: name,
        slug: slugify(name),
        description,
        // productPictures,
        createdBy: req.user._id,
      };

      return Brand.findOneAndUpdate(condition, update, { upsert: true })
        .then((result) => res.status(201).json({ brands: result }))
        .catch((err) => console.log("err: ", err));
    } else {
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
    }
  });
};
exports.getBySlug = (req, res) => {
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

exports.getByID = (req, res) => {
  const { id } = req.params;
  if (id) {
    Brand.findOne({ _id: id }).exec((error, brand) => {
      if (error) return res.status(400).json({ error });
      if (brand) {
        res.status(200).json({ brand });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.deleteByID = (req, res) => {
  // const { brandId } = req.body.payload;

  const { id } = req.body;
  if (id) {
    Brand.deleteOne({ _id: id }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.selectAll = async (req, res) => {
  const brands = await Brand.find({ createdBy: req.user._id })
    .select("_id name slug description createdBy timestamps")
    .exec();

  res.status(200).json({ brands });
};
