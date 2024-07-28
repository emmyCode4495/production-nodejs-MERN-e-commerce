import productModel from "../models/ProductsModel.js"
import orderModel from "../models/orderModel.js"

//CREATE ORDERS
export const createOrderController = async (req,res)=>{
    try{
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        } = req.body

        await orderModel.create({
            user:req.user._id,
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        })

        //stock update
        for(let i = 0; i < orderItems.length; i++){
            //find product
            const product = await productModel.findById(orderItems[i].product)
            product.stock -= orderItems[i].quantity

            await product.save()
        }
        res.status(201).send({
            success:true,
            message:"Order Placed successfully"
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in create order API",
            error
        })
    }
}

// GET ALL ORDERS
export const getAllOrdersController = async (req, res) =>{
    try{
        // find orders
        const orders = await orderModel.find({user: req.user._id})
        //validation
        if(!orders){
            return res.status(404).send({
                success:false,
                message: 'No orders found'
            })
        }
        res.status(200).send({
            success:true,
            message:"All available orders",
            totalOrders: orders.length,
            orders
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in get orders API",
            error
        })
    }
}

// GET SINGLE ORDER INFO
export const getSingleOrderDetailsController = async (req, res) =>{
    try{
        //find orders
        const order = await orderModel.findById(req.params.id)
        //validation
        if(!order){
            return res.status(404).send({
                success:false,
                message:"Order doesn't exist"
            })
        }
        res.status(200).send({
            success:true,
            message:"order fetched successfully",
            order
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

//======== ADMIN SECTION ==========
// get all orders
export const adminGetAllOrdersController = async (req,res) =>{
    try{
        const orders = await orderModel.find()
        res.status(200).send({
            success:true,
            message:"All orders retrieved",
            totalOrders:orders.length,
            orders
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Admin order API"
        })
    }
}


// Modify order status
export const changeOrderStatusController = async (req, res) =>{
try{
    //find order
    const order = await orderModel.findById(req.params.id)
    //validation
    if(!order){
        return res.status(404).send({
            success:false,
            message:"Order not found"
        })
    }
    if(order.orderStatus === "processing") order.orderStatus = "shipped"
    else if(order.orderStatus === "shipped"){
        order.orderStatus = "delivered"
        order.deliveredAt = new Date.now()
    }else{
        return res.status(500).send({
            success:false,
            message:'order already delivered'
        })
    }
    await order.save()
    res.status(200).send({
        success:true,
        message:'order status updated'
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
            message:'Error in Update order status API',
            error
        })
}
}