const ItemType = require("../../models/itemTypes");
const shortid = require("shortid");
const slugify = require("slugify");
exports.create = (req, res) => {
  //res.status(200).json( { file: req.files, body: req.body } );

  const { name, id, description, createdBy } = req.body;

  ItemType.findOne({ _id: id }).exec((error, brand) => {
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

      return ItemType.findOneAndUpdate(condition, update, {
        returnOriginal: false,
      })
        .then((result) => res.status(201).json({ brands: result }))
        .catch((err) => console.log("err: ", err));
    } else {
      const ItemTypes = new ItemType({
        name: name,
        slug: slugify(name),
        description,
        // productPictures,
        createdBy: req.user._id,
      });

      ItemTypes.save((error, ItemTypes) => {
        if (error) return res.status(400).json({ error });
        if (ItemTypes) {
          res.status(201).json({ ItemTypes });
        }
      });
    }
  });
};
exports.getBySlug = (req, res) => {
  const { slug } = req.params;
  if (slug) {
    ItemType.find({ slug: { $regex: ".*" + slug + ".*" } }).exec(
      (error, ItemType) => {
        if (error) return res.status(400).json({ error });
        if (ItemType) {
          res.status(200).json({ ItemType });
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
    ItemTypes.findOne({ _id: id }).exec((error, brand) => {
      if (error) return res.status(400).json({ error });
      if (brand) {
        res.status(200).json({ ItemTypes });
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
    ItemType.deleteOne({ _id: id }).exec((error, result) => {
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
  const ItemTypes = await ItemType.find({ createdBy: req.user._id })
    .select("_id name slug createdBy timestamps")
    .exec();

  res.status(200).json({ ItemTypes });
};
