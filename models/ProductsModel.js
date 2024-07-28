import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required"]
    },
    rating:{
        type:Number,
        default:0
    },
    comment:{
        type:String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required:[true, 'user is required']
    }
}, {timestamps: true})


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'product name required']
    },
    description:{
        type:String,
        required:[true, 'product description name required']
    },
    price:{
        type:Number,
        required:[true, 'product price name required']
    },
    stock:{
        type:Number,
        required:[true, 'product stock name required']
    },
    // quantity:{
    //     type:Number,
    //     required:[true, 'product quantity name required']
    // },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    images:[
        {
            public_id:String,
            url:String
        }
    ],
    reviews:[reviewSchema],
    rating:{
        type:Number,
        default:0
    },
    numReviews:{
        type:Number,
        default:0
    }
}, {timestamps:true})

export const productModel = mongoose.model("Products",productSchema)

export default productModel