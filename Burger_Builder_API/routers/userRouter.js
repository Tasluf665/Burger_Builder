const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");

const router = express.Router();

const newUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .send({ error: "User is already register with this email" });

  user = new User(_.pick(req.body, ["email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateJWT();

  const result = await user.save();

  return res.status(201).send({
    token: token,
    user: _.pick(result, ["_id", "email"]),
  });
};

const authUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ error: "Invalide email or password" });

  const validUser = await bcrypt.compare(req.body.password, user.password);
  if (!validUser)
    return res.status(400).send({ error: "Invalide email or password" });

  const token = user.generateJWT();

  return res.send({
    token: token,
    user: _.pick(user, ["_id", "email"]),
  });
};

router.route("/").post(newUser);

router.route("/auth").post(authUser);

module.exports = router;
