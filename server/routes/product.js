const express = require("express");
const multer = require("multer");
const router = express.Router();
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  // 가져온 이미지를 저장을 해주면 된다.
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
      //return req.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      filename: res.req.file.filename,
    });
  });
});

router.post("/", (req, res) => {
  //받아온 정보들을 db에 넣어준다
  const product = new Product(req.body);
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log(key);

      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0], //크거나같다
          $lte: req.body.filters[key][1], //작거나같다
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  console.log("findArgs", findArgs);

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } }) //mongoDB기능
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, productInfo });
      });
  } else {
    // product collection에 들어있는 모든 상품 정보를 가져오기
    Product.find(findArgs)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, productInfo });
      });
  }
});

router.get(`/products_by_id`, (req, res) => {
  let type = req.query.type;
  let productId = req.query.id;

  //productId를 이용해서 db에서 productId의 정보를 가져온다
  Product.find({ _id: productId })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ success: true, product });
    });
});

module.exports = router;
