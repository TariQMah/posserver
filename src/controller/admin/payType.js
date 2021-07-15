const PayType = require("../../models/PayType");
const shortid = require("shortid");
const slugify = require("slugify");

exports.create = (req, res) => {
  //res.status(200).json( { file: req.files, body: req.body } );
  const { name, id, createdBy } = req.body;

  PayType.findOne({ _id: id }).exec((error, PayType) => {
    if (error) return res.status(400).json({ error });
    if (PayType) {
      condition = { _id: id };
      update = {
        name: name,
        slug: slugify(name),
        createdBy: req.user._id,
      };

      return PayType.findOneAndUpdate(condition, update, {
        returnOriginal: false,
      })
        .then((result) => res.status(201).json({ PayTypes: result }))
        .catch((err) => console.log("err: ", err));
    } else {
      const PayTypes = new PayType({
        name: name,
        slug: slugify(name),
        createdBy: req.user._id,
      });

      PayTypes.save((error, PayTypes) => {
        if (error) return res.status(400).json({ error });
        if (PayTypes) {
          res.status(201).json({ PayTypes });
        }
      });
    }
  });
};
exports.getBySlug = (req, res) => {
  const { slug } = req.params;
  if (slug) {
    PayType.find({ slug: { $regex: ".*" + slug + ".*" } }).exec(
      (error, PayType) => {
        if (error) return res.status(400).json({ error });
        if (PayType) {
          res.status(200).json({ PayType });
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
    PayTypes.findOne({ _id: id }).exec((error, brand) => {
      if (error) return res.status(400).json({ error });
      if (brand) {
        res.status(200).json({ PayTypes });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteByID = (req, res) => {
  // const { brandId } = req.body.payload;

  const { id } = req.body;
  if (id) {
    PayType.deleteOne({ _id: id }).exec((error, result) => {
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
  const PayTypes = await PayType.find({ createdBy: req.user._id });

  res.status(200).json({ PayTypes });
};