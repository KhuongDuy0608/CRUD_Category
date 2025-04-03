var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { check_authentication,check_authorization } = require('../utils/check_auth')
let { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler')
let constants = require('../utils/constants');
const { validatorCreateUser, validate } = require('../utils/validators');


/* GET users listing. */
router.get('/', check_authentication,
  check_authorization(constants.MOD_PERMISSION)
,async function (req, res, next) {
  try {
    let users = await userController.GetAllUsers();
    CreateSuccessRes(res, users, 200);
  } catch (error) {
    next(error)
  }
});
router.get('/:id', check_authentication, async function (req, res, next) {
  try {
      let { id: requestedUserId } = req.params;
      let { _id } = req.user;

      if (constants.MOD_PERMISSION.find(role => role === req.user.role.name) || _id.toString() === requestedUserId) {
          let user = await userController.GetUserByID(requestedUserId);
          CreateSuccessRes(res, user, 200);
      }
      CreateErrorRes(res, "Khong the xem thong tin cua nguoi khac", 403);
  } catch (error) {
      next(error);
  }
});

router.post('/',check_authentication, check_authorization(constants.ADMIN_PERMISSION), validate, async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.CreateAnUser(
      body.username, body.password, body.email, body.role
    )
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION),async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.UpdateAnUser(req.params.id, body)
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION),async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.DeleteAnUser(req.params.id)
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;