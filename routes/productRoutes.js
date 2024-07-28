import express from 'express'
import { createProductController, deleteProductController, deleteProductImageController, getAllProductsController, getSingleProductController, getTopProductsController, productReviewController, updateProductController, updateProductImageController } from '../controllers/productsController.js'
import { isAuth, isAdminAuth } from '../middlewares/authMiddleware.js'
import { singleLineUp } from '../middlewares/multer.js'

const router = express.Router()

// routes
//GET ALL PRODUCTS
router.get('/get-all', getAllProductsController)

//GET TOP PRODUCTS
router.get('/top', getTopProductsController)

//GET SINGLE PRODUCT
router.get('/:id', getSingleProductController)

//CREATE PRODUCTS
router.post('/create', singleLineUp,isAuth,isAdminAuth,createProductController)

//UPDATE PRODUCTS
router.put('/:id',isAuth, isAdminAuth,updateProductController)

//UPDATE IMAGE API
router.put('/image/:id',isAuth,singleLineUp, isAdminAuth,updateProductImageController)


//delete IMAGE API
router.delete('/delete-image/:id',isAuth, isAdminAuth,deleteProductImageController)

//delete product
router.delete('/delete/:id',isAuth,isAdminAuth, deleteProductController)

//REVIEW PRODUCT
router.put('/:id/review', isAuth, productReviewController)
export default router