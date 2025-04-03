var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/categories')
let { check_authentication,check_authorization } = require('../utils/check_auth')

let {CreateErrorRes,CreateSuccessRes} = require('../utils/responseHandler')
let constants = require('../utils/constants')

const slugify = require('slugify');

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

router.get('/:slugCategory', async function (req, res, next) {
    try {
        let category = await categoryModel.findOne({
            slug: req.params.slug,
            isDeleted: false
        });

        if (!category) {
            return CreateErrorRes(res, "Khong tim thay category", 404);
        }

        CreateSuccessRes(res, category, 200);
    } catch (error) {
        next(error);
    }
});


router.post('/', check_authentication,check_authorization(constants.MOD_PERMISSION),async function(req, res, next) {
  try {
    let {name} = req.body
    let slug = slugify(name, { lower: true, strict: true });
    let newCategory = new categoryModel({
      name, slug
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
    let {name} = req.body
    let updatedInfo = {};
    if(name){
      updatedInfo.name = name;
      updatedInfo.slug = slugify(name, { lower: true, strict: true });
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