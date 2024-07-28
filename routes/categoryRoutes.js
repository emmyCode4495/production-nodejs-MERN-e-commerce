import express from 'express'
import { isAuth, isAdminAuth} from '../middlewares/authMiddleware.js'
import { singleLineUp } from '../middlewares/multer.js'
import { createCategoryController, deleteCategoryController, getAllCategoryController, updateCategoryController } from '../controllers/categoryController.js'

const router = express.Router()

// ============= CATEGORY ROUTES ==============
// CREATE CATEGORY
router.post('/create', isAuth,isAdminAuth,createCategoryController)

// GET ALL CATEGORY
router.get('/get-all', getAllCategoryController)

// DELETE CATEGORY
router.delete('/delete/:id', isAuth,isAdminAuth, deleteCategoryController)

// UPDATE CATEGORY
router.put('/update/:id', isAuth, isAdminAuth,updateCategoryController)
export default router