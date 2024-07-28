import express from 'express'
import { forgotPasswordController, getUserProfileController, loginController, logoutController, registerController, updatePasswordController, updateProfileController, updateProfilePicController } from '../controllers/userController.js'
import  {isAdminAuth, isAuth}  from '../middlewares/authMiddleware.js'
import { singleLineUp } from '../middlewares/multer.js'
import { rateLimit } from 'express-rate-limit'

// RATE LIMITER
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})


//router object
const router = express.Router()

//routes
router.post('/register',limiter,registerController)

//login
router.post('/login', limiter,loginController)

//profile
router.get('/profile',isAuth, getUserProfileController)

//logout
router.get('/logout', isAuth, logoutController)

//update profile
router.put('/profile-update', isAuth, updateProfileController)

//update Password
router.put('/update-password',isAuth, updatePasswordController)

//update profile picture
router.put('/update-picture',isAuth,singleLineUp, updateProfilePicController)

//FORGOT PASSWORD
router.post('/reset-password', forgotPasswordController)
//export
export default router   