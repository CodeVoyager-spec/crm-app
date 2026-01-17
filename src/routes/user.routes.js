const router = require("express").Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validate");
const { updateUserSchema } = require("../src/validators/user.validator");

// All routes require authentication
router.use(authenticate);

// All routes below are ADMIN-only
router.use(authorize("ADMIN"));

router.route("/users").get(userController.getAllUsers);

router
  .route("/users/:userId")
  .get(userController.getUserById)
  .put(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
