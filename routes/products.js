var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')
let categoryModel = require('../schemas/categories')
let { check_authentication,check_authorization } = require('../utils/check_auth')

let {CreateErrorRes,CreateSuccessRes} = require('../utils/responseHandler');
const constants = require('../utils/constants');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await productModel.find({
    isDeleted:false
  }).populate('category')
  CreateSuccessRes(res,products,200);
});
router.get('/:id', async function(req, res, next) {
  try {
    let product = await productModel.findOne({
      _id:req.params.id, isDeleted:false
    }
      
    )
    CreateSuccessRes(res,product,200);
  } catch (error) {
    next(error)
  }
  
});
router.post('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  try {
      let { name, price, quantity, category } = req.body;

      let categoryObj = await categoryModel.findOne({ name: category });
      if (!categoryObj) {
          throw new Error("category không tồn tại");
      }

      let slug = slugify(name, { lower: true, strict: true });

      let newProduct = new productModel({
          name,
          slug,
          price,
          quantity,
          category: categoryObj._id
      });

      await newProduct.save();
      CreateSuccessRes(res, newProduct, 200);
  } catch (error) {
      next(error);
  }
});


router.put('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  let id = req.params.id;
  try {
      let { name, price, quantity, category } = req.body;
      let updatedInfo = {};

      if (name) {
          updatedInfo.name = name;
          updatedInfo.slug = slugify(name, { lower: true, strict: true }); 
      }
      if (price) {
          updatedInfo.price = price;
      }
      if (quantity) {
          updatedInfo.quantity = quantity;
      }
      if (category) {
          updatedInfo.category = category;
      }

      let updateProduct = await productModel.findByIdAndUpdate(id, updatedInfo, { new: true });
      CreateSuccessRes(res, updateProduct, 200);
  } catch (error) {
      next(error);
  }
});

router.delete('/:id', check_authentication,check_authorization(constants.ADMIN_PERMISSION),async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updateProduct = await productModel.findByIdAndUpdate(
      id,{
        isDeleted:true
      },{new:true}
    )
    CreateSuccessRes(res,updateProduct,200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;