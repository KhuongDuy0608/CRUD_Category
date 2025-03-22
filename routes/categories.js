var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/categories')
let { check_authentication,check_authorization } = require('../utils/check_auth')

let {CreateErrorRes,CreateSuccessRes} = require('../utils/responseHandler')
let constants = require('../utils/constants')

router.get('/', async function(req, res, next) {
  let categories = await categoryModel.find({
    isDeleted:false
  })
  CreateSuccessRes(res,categories,200);
});

router.get('/:id', async function(req, res, next) {
  try {
    let category = await categoryModel.findOne({
      _id:req.params.id, isDeleted:false
    }
      
    )
    CreateSuccessRes(res,category,200);
  } catch (error) {
    next(error)
  }
  
});
router.post('/', check_authentication,check_authorization(constants.MOD_PERMISSION),async function(req, res, next) {
  try {
    let body = req.body
    let newCategory = new categoryModel({
      name:body.name
    })
    await newCategory.save();
    CreateSuccessRes(res,newCategory,200);
  } catch (error) {
    next(error)
  }
});
router.put('/:id', check_authentication,check_authorization(constants.MOD_PERMISSION),async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updatedInfo = {};
    if(body.name){
      updatedInfo.name = body.name;
    }
    let updateCategory = await categoryModel.findByIdAndUpdate(
      id,updatedInfo,{new:true}
    )
    CreateSuccessRes(res,updateCategory,200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id', check_authentication,check_authorization(constants.ADMIN_PERMISSION),async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updateCategory = await categoryModel.findByIdAndUpdate(
      id,{
        isDeleted:true
      },{new:true}
    )
    CreateSuccessRes(res,updateCategory,200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;