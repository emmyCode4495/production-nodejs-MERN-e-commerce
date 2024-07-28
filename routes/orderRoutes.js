import express from 'express'
import { isAdminAuth, isAuth } from '../middlewares/authMiddleware.js'
import { adminGetAllOrdersController, changeOrderStatusController, createOrderController, getAllOrdersController, getSingleOrderDetailsController } from '../controllers/orderController.js'



const router = express.Router()

// ============= ORDER ROUTES ==============
// CREATE ORDER
router.post('/create', isAuth,createOrderController)

//GET ALL ORDERS
router.get('/my-orders',isAuth, getAllOrdersController)

//GET SINGLE ORDERS
router.get('/my-orders/:id',isAuth, getSingleOrderDetailsController)

// ========= ADMIN SECTION ============
//GET ALL ORDERS
router.get('/admin/get-all-orders', isAuth,isAdminAuth, adminGetAllOrdersController)
 
//update order status
router.put('/admin/orders/:id',isAdminAuth,isAuth, changeOrderStatusController)
export default router