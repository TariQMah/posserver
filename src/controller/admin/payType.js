const PayTypeModel = require("../../models/PayType");
const slugify = require("slugify");

exports.create = (req, res) => {
  //res.status(200).json( { file: req.files, body: req.body } );
  const { name, id, createdBy } = req.body;
  console.log("req.body: ", req.body);

  PayTypeModel.findOne({ _id: id }).exec((error, PayType) => {
    if (error) return res.status(400).json({ error });
    if (PayType) {
      condition = { _id: id };
      update = {
        name: name,
        slug: slugify(name),
        createdBy: req.user._id,
      };

      return PayTypeModel.findOneAndUpdate(condition, update, {
        returnOriginal: false,
      })
        .then((result) => res.status(201).json({ PayTypes: result }))
        .catch((err) => console.log("err: ", err));
    } else {
      const PayTypes = new PayTypeModel({
        name: name,
        slug: slugify(name),
        createdBy: req.user._id,
      });

      PayTypes.save((error, payTypeRecord) => {
        if (error) return res.status(400).json({ error });
        if (payTypeRecord) {
          res.status(201).json({ PayTypes });
        }
      });
    }
  });
};
exports.getBySlug = (req, res) => {
  const { slug } = req.params;
  if (slug) {
    PayTypeModel.find({ slug: { $regex: ".*" + slug + ".*" } }).exec(
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
    PayTypeModel.findOne({ _id: id }).exec((error, brand) => {
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
    PayTypeModel.deleteOne({ _id: id }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ msg: "Record Deleted" });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.selectAll = async (req, res) => {
  const PayTypes = await PayTypeModel.find({ createdBy: req.user._id });

  res.status(200).json({ PayTypes });
};
