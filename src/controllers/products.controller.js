const express = require("express");

const router = express.Router();

const Products = require("../models/products.model");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.post("/", async function (req, res) {
  const item = await Products.create(req.body);
  // const user = req.user;

  return res.send({ item });
});

router.get(
  "/",
  authenticate,
  authorize(["admin", "seller", "user"]),
  async function (req, res) {
    const products = await Products.find().lean().exec();
    const user = req.user;

    return res.send({ products, user });
  }
);

router.patch(
  "/:id",
  authenticate,
  authorize(["admin", "seller"]),
  async function (req, res) {
    const products = await Products.updateOne(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    const user = req.user;

    return res.send({ products, user });
  }
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "seller"]),
  async function (req, res) {
    const products = await Products.findByIdAndDelete({ _id: req.params.id });
    const user = req.user;

    return res.send({ products, user });
  }
);

module.exports = router;
