const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');
const { default: mongoose } = require('mongoose');

const createOrderController = {
    // validation: async (req, res, next) => {
    //     try {
    //         const schema = joi.object({
    //             name: joi.string().required(),
    //             price: joi.number().required(),
    //             categoryId: joi.string().min(12).required(),
    //             createdBy: joi.string().min(12).required()
    //         });
    
    //         const reqPayload = req?.body;
    
    //         await schema.validateAsync({
    //             name: reqPayload?.name,
    //             price: reqPayload?.price,
    //             categoryId: reqPayload?.categoryId,
    //             createdBy: req?.admin?._id
    //         });

    //         next();
    //     } catch (err) {
    //         console.log(err, 'createProductValidationError');
    //         res?.status(400).json({
    //             errorMessage: err?.message
    //         });
    //     }
        
    // },
    handler: async (req, res, next) => {
        try {

            const user = req?.user;

            const fetchedCartOfUserInDB = await global?.models?.CART?.findOne(
                { userId: new mongoose.Types.ObjectId(user?._id) }
            )
            ?.populate('products.productId')
            ?.lean();

            let totalCost = 0;

            for (let i = 0; i < fetchedCartOfUserInDB?.products?.length; i++) {
                totalCost += fetchedCartOfUserInDB?.products?.[i]?.productId?.price * fetchedCartOfUserInDB?.products?.[i]?.count;
            }

            const newOrder = {
                cart: {
                    ...fetchedCartOfUserInDB,
                    products: fetchedCartOfUserInDB?.products?.map(product => {
                        return {
                            productId: product?.productId,
                            price: product?.productId?.price,
                            count: product?.count
                        }
                    })
                },
                totalCost,
                status: 'pending'
            };

            console.log(newOrder, 'newOrder');

            const newProductInDB = await global?.models?.ORDER?.create(newOrder);

            if (newProductInDB?._id) {
                res?.status(200)?.json({
                    payload: {
                        item: newProductInDB
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured`);
            }
        } catch (err) {
            console.log(err, 'createProductHandlerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    createOrderController
};