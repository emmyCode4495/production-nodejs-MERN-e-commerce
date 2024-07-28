//GET ALL PRODUCTS

import productModel from "../models/ProductsModel.js"
import { getDataUri } from "../utils/features.js"
import cloudinary from 'cloudinary'

export const getAllProductsController = async (req,res)=>{
    const {keyword, category} = req.query

    try{
        const products = await productModel.find({
            name:{
                $regex: keyword ? keyword: '',
                $options: "i"
            },
            
        })
        .populate('category')
        res.status(200).send({
            success:true,
            message:"All products fetched successfully",
            totalProducts:products.length,
            products
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in get products API',
            error
        })
    }
}

//GET TOP PRODUCTS
export const getTopProductsController = async (req, res)=>{
    try{
        const products = await productModel.find({}).sort({rating:-1}).limit(3)
        res.status(200).send({
            success:true,
            message:"Top products retrieved successfully",
            products
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in get top products API',
            error
        })
    }
}
// GET SINGLE PRODUCT
export const getSingleProductController = async (req,res) =>{
    try{
        //get product id
        const product = await productModel.findById(req.params.id)
        //validarion
        if(!product){
            return res.status(404).send({
                success:false,
                message:'Product not found'
            })
        }
        res.status(200).send({
            success:true,
            message:'product Found',
            product
    })
        }catch(error){
        console.log(error)
        if(error.name === 'CastError'){
            res.status(500).send({
                success:false,
                message:'Invalid Product id',
                error
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in get products API',
            error
        })
    }
}

//CREATE PRODUCT
export const createProductController = async (req,res) =>{
    try{
        const {name, description,price,category,stock} = req.body
        //validate
        // if(!name || !description || !price || !stock){
        //     return res.status(500).send({
        //         success:false,
        //         message:"Please Provide all fields"
        //     })
        // }
        if(!req.file){
            return res.status(500).send({
                success:false,
                message:'Please provide product images'
            })
        }
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id : cdb.public_id,
            url: cdb.secure_url
        }
      
        await productModel.create({
            name,description,price,category,stock,images:[image]
        })
        
        res.status(201).send({
            success:true,
            message:"Product created successfully"
        })
    }catch(error){
        console.log(error)
            res.status(500).send({
                success:false,
                message:'Error in create  product API',
                error
            })
    }

}

//UPDATE PRODUCTS
export const updateProductController = async (req,res) =>{
    try{
        //find product
        const product = await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(404).send({
                success:false,
                message:'Product not found'
            })
        }
        const {name, description,price, stock,category} = req.body
        //validate and update
        if(name) product.name = name
        if(description) product.description = description
        if(price) product.price = price
        if(stock) product.stock = stock
        if(category) product.category = category

        await product.save()
        res.status(200).send({
            success:true,
            message:'product details updated'
        })
    }catch(error){
        console.log(error)
        if(error.name === 'CastError'){
            res.status(500).send({
                success:false,
                message:'Invalid Product id',
                error
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in update product API',
            error
        })
    }
}

//UPDATE PRODUCT IMAGE
export const updateProductImageController = async (req,res) =>{
    try{
        //find product
        const product = await productModel.findById(req.params.id)
        //valdation
        if(!product){
            return res.status(404).send({
                success:false,
                message:"Product not found"
            })
        }

        //check file
        if(!req.file){
            return res.status(404).send({
                success:false,
                message:'File not found'
            })
        }

        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }

        //save
        product.images.push(image)
        await product.save()
        res.status(200).send({
            success:true,
            message:"Image updated successfully"
        })
    }catch(error){
        console.log(error)
        //cast error \\ Object ID
        if(error.name === 'CastError'){
            return res.status(500).send({
                success:false,
                message:"Invald ID"
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in get products API',
            error
        })
    }
}

//DELETE THE PRODUCT IMAGE
export const deleteProductImageController = async (req,res) =>{
    try{
        //find product
        const product = await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(404).send({
                success:false,
                message:'Product Image Not found'
            })
        }

        //Image ID find
        const id = req.query.id
        if(!id){
            return res.status(404).send({
                success:false,
                message:"Product Image not found"
            })
        }
        let isExist = -1
        product.images.forEach((item, index) =>{
            if(item._id.toString() === id.toString()) isExist = index
        })
        if(isExist < 0){
            return res.status(404).send({
                success:false,
                message:"Image not found"
            })
        }
        //DELETE PRODUCT IMAGE
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
        product.images.splice(isExist,1)
        await product.save()
        return res.status(200).send({
            success:true,
            message:"Product Image deleted successfully"
        })
    }catch(error){
        console.log(error)
        //cast error \\ Object ID
        if(error.name === 'CastError'){
            return res.status(500).send({
                success:false,
                message:"Invald ID"
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in delete products API',
            error
        })
    }
    
}

// Delete product
export const deleteProductController = async (req,res) =>{
    try{
        //find product
        const product = await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(404).send({
                success:false,
                message:'Product not found'
            })
        }
        // find and delete image in cloudinary
        for(let index = 0; index < product.images.length; index++){
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        await product.deleteOne()
        res.status(200).send({
            successs:true,
            message:'Product Deleted successfully'
        })
    }catch(error){
        console.log(error)
        //cast error \\ Object ID
        if(error.name === 'CastError'){
            return res.status(500).send({
                success:false,
                message:"Invald ID"
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in delete products API',
            error
        })
    }
    }

    // CCREATE PRODUCT REVIEW
    export const productReviewController = async (req,res) =>{
        try{
            const {comment, rating} = req.body
            //find product
            const product = await productModel.findById(req.params.id)
            //check for previous review
            const alreadyReviewed = product.reviews.find((r)=> r.user.toString() === req.user._id.toString())
            if(alreadyReviewed){
                return res.status(400).send({
                    success:false,
                    message:"Product already reviewed"
                })
            }
            // review object
            const review = {
                name:req.user.name,
                rating:Number(rating),
                comment,
                user:req.user._id
            }
            // passing review object to reviews array
            product.reviews.push(review)
            // number of reviews
            product.numReviews = product.reviews.length
            product.rating = product.reviews.reduce((acc, item) => item.rating = acc, 0)/product.reviews.length

            //save
            await product.save()
            res.status(200).send({
                success:true,
                message:"Review added"
            })
        }catch(error){
            console.log(error)
        //cast error \\ Object ID
        if(error.name === 'CastError'){
            return res.status(500).send({
                success:false,
                message:"Invald ID"
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in products review API',
            error
        })
        }
    }
