const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const { signupSchema, signinSchema } = require("../validators/auth.validator");

const router = Router();

router
  .route("/auth/signup")
  .post(validate(signupSchema), authController.signup);

router
  .route("/auth/signin")
  .post(validate(signinSchema), authController.signin);

module.exports = router;
