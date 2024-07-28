import userModel from '../models/UserModel.js'
import { getDataUri } from '../utils/Features.js';
import cloudinary from 'cloudinary'

// REGISTER CONTROLLER
export const registerController = async (req,res) =>{
    try{
        const {name, email, password,address,city,country, answer,phone} = req.body
        //validaion
        if(!name || !email || !password || !address || !city || !country || !phone){
            return res.status(500).send({
                success:false,
                message:"Please provide all fields"
            })
        }

        //check for existing user
        const existingUser = await userModel.findOne({email})
        // validation
        if(existingUser){
            return res.status(500).send({
                success:false,
                message: "email already exists"
            })
        }
        const user = await userModel.create({
            name, 
            email, 
            password, 
            address, 
            city, 
            country,
            phone,
            answer
        })
        res.status(201).send({
            success:true,
            message:'Registration successful, please login',
            user
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in register API',
            error
        })
    }
};

//LOGIN
export const loginController = async (req,res) =>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(500).send({
                success:false,
                message:"Please add email or password"
            })
        }
        // check user
        const user = await userModel.findOne({email})
        //user Vaidation
        if(!user){
            return res.status(404).send({
               success: false,
               message:"User not found"
            })
        }
        //check pass

        const ismatch = await user.comparePassword(password)
        //validation pass
        if(!ismatch){
            return res.status(500).send({
                success:false,
                message:'invalid credentials'
            })
        }
        //token
        const token = user.generateToken()
        res.status(200).cookie("token", token,{
            expires:new Date(Date.now() + 15 * 24 * 60 * 1000),
            secure:process.env.NODE_ENV === 'development'? true : false,
            httpOnly:process.env.NODE_ENV === 'development'? true : false,
            sameSite:process.env.NODE_ENV === 'development'? true : false
        }).send({
            success:true,
            message:"Login Successfully",
            token,
            user,
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:"false",
            message:"Error in Login",
            error
        })
    }
}

// GET USER PROFILE
export const getUserProfileController = async (req,res)=>{
    try{
        const user = await userModel.findById(req.user._id)
        user.password = undefined
        res.status(200).send({
            success:true,
            message:"User profile fetched successfully",
            user,
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Profile API"
        })
    }
}

//LOGOUT
export const logoutController = async (req,res) =>{
    try{
       res.status(200).cookie("token","",{
        expires:new Date(Date.now() + 15 * 24 * 60 * 1000),
        secure:process.env.NODE_ENV === 'development'? true : false,
        httpOnly:process.env.NODE_ENV === 'development'? true : false,
        sameSite:process.env.NODE_ENV === 'development'? true : false
    }).send({
        success:true,
        message:'Logout Successfully'
    })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Logout API"
        })
    }
}

//update prfile
export const updateProfileController = async (req,res) =>{
    try{
        const user = await userModel.findById(req.user._id)
        const {name,email,address,city,country,phone} = req.body
        //validation
        if(name) user.name = name
        if(email) user.email = email
        if(address) user.address = address
        if(city) user.city = city
        if(country) user.country = country
        if(phone) user.phone = phone

        //save user
        await user.save()
        res.status(200).send({
            success:true,
            message:"Updated user profile successfully"
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Update Profile API"
        })
    }
}

// Update user password
export const updatePasswordController = async (req,res) =>{
    try{
        const user = await userModel.findById(req.user)
        const {oldPassword, newPassword} = req.body
        //validation
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success:false,
                message:"Please provide old or new password"
            })
        }
        //old pass check
        const isMatch = await user.comparePassword(oldPassword)
        //validation
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message:"Invalid old password",
            })
        }
        user.password = newPassword
        await user.save()
        res.status(200).send({
            success:true,
            message:"Password updated successfully"
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Update Password API"
        })
    }
}

//Update Profile Picture
export const updateProfilePicController = async (req,res) =>{
    try{
        const user = await userModel.findById(req.user._id)
        //file get from client photo
        const file = getDataUri(req.file)
        // delete prev image
        // await cloudinary.v2.uploader.destroy(user.profilePic.public_id)
        // update
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        user.profilePic ={
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        //save function
        await user.save()

        res.status(200).send({
            success:true,
            message:"Profile picture updated successfully"
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Update profile pictures API"
        })
    }
}

// FORGOT PASSWORD
export const forgotPasswordController = async (req,res) =>{
    try{
        // user get email \\ new password\\ answer
        const {email, newPassword, answer} = req.body

        if(!email || !newPassword || !answer){
            return res.status(500).send({
                success:false,
                message:"Provide all fields"
            })
        }
        // find user
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Invalid user or answer"
            })
        }

        user.password = newPassword
        await user.save()
        res.status(200).send({
            success:true,
            message:"Your password has been reset, Login"
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in reset password API"
        })
    }
}