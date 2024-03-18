const mongoose = require('mongoose');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const updateProductsInCartController = {
    validation: async (req, res, next) => {
        try {
            const actionSchema = joi.object({
                action: joi.string().valid('add', 'update', 'remove', 'clear').required()
            })
            const updateAndAddSchema = joi.object({
                products: joi.array().items(
                    joi.object({
                        productId: joi.string().min(12).required(),
                        count: joi.number().integer().min(1).required()
                    })
                ),
                action: joi.string().valid('add', 'update'),
                cartId: joi.string().min(12).required()
            });

            const removeSchema = joi.object({
                products: joi.array().items(
                    joi.string().min(12).required()
                ),
                action: joi.string().valid('remove'),
                cartId: joi.string().min(12).required()
            });

            const clearSchema = joi.object({
                action: joi.string().valid('clear').required(),
                cartId: joi.string().min(12).required()
            })

            let schema;

            await actionSchema.validateAsync({
                action: req?.body?.action,
            });

            if (req?.body?.action === 'add' || req?.body?.action === 'update') {
                schema = updateAndAddSchema;
            } else if (req?.body?.action === 'remove') {
                schema = removeSchema;
            } else if (req?.body?.action === 'clear') {
                schema = clearSchema;
            }

            await schema.validateAsync(req?.body);
            next();
        } catch (err) {
            console.log(err, 'updateProductsInCartValidation');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {

            const cartId = req?.body?.cartId;
            const products = req?.body?.products;
            const action = req?.body?.action;

            const customer = req?.customer;

            let updatedCartInDb;

            if (action === 'add') {

                const fetchedToBeAddedProducts = await global?.models?.PRODUCT?.find(
                    {
                        _id: {
                            $in: products?.map(product => {
                                return new mongoose.Types.ObjectId(product?.productId)
                            })
                        },
                    }
                );  

                for (let i = 0; i < fetchedToBeAddedProducts?.length; i++) {
                    for (let j = 0; j < products?.length; j++) {
                        if (fetchedToBeAddedProducts?.[i]?._id?.equals(products?.[j]?.productId)) {
                            if (fetchedToBeAddedProducts?.[i]?.stock < products?.[i]?.count) {
                                throw new Error(`ProductId(${products?.[i]?.productId}) count cannot be greater than the stock!`);
                            }
                        } 
                    }
                }

                updatedCartInDb = await global?.models?.CART?.findOneAndUpdate(
                    { 
                        _id: new mongoose.Types.ObjectId(cartId),
                        customerId: new mongoose.Types.ObjectId(customer?._id),
                        "products.productId": {
                            $nin: products?.map(product => {
                                return new mongoose.Types.ObjectId(product?.productId)
                            })
                        }
                    },
                    {
                        $addToSet: {
                            products: products?.map(product => {
                                return {
                                    ...product,
                                    productId: new mongoose.Types.ObjectId(product?.productId)
                                }
                            })
                        }
                    },
                    { new: true }
                );
            } else if (action === 'remove') {
                updatedCartInDb = await global?.models?.CART?.findOneAndUpdate(
                    { 
                        _id: new mongoose.Types.ObjectId(cartId),
                        customerId: new mongoose.Types.ObjectId(customer?._id)
                    },
                    {
                        $pull: {
                            products: {
                                productId: {
                                    $in: products?.map(productId => {
                                        return new mongoose.Types.ObjectId(productId);
                                    })
                                }
                            } 
                        }
                    },
                    { new: true }
                );
            } else if (action === 'update') {

                const fetchedToBeAddedProducts = await global?.models?.PRODUCT?.find(
                    {
                        _id: {
                            $in: products?.map(product => {
                                return new mongoose.Types.ObjectId(product?.productId)
                            })
                        },
                    }
                );  

                for (let i = 0; i < fetchedToBeAddedProducts?.length; i++) {
                    for (let j = 0; j < products?.length; j++) {
                        if (fetchedToBeAddedProducts?.[i]?._id?.equals(products?.[j]?.productId)) {
                            if (fetchedToBeAddedProducts?.[i]?.stock < products?.[i]?.count) {
                                throw new Error(`ProductId(${products?.[i]?.productId}) count cannot be greater than the stock!`);
                            }
                        } 
                    }
                }

                const fetchedCartFromDB = await global?.models?.CART?.findOne(
                    { 
                        _id: new mongoose.Types.ObjectId(cartId),
                        customerId: new mongoose.Types.ObjectId(customer?._id)
                    }
                )?.lean();

                let cartProducts = fetchedCartFromDB?.products;

                for (let i = 0; i < products?.length; i++) {
                    cartProducts = cartProducts?.map(cartProduct => {
                        if (cartProduct?.productId?.equals(new mongoose.Types.ObjectId(products?.[i]?.productId))) {
                            return {
                                ...cartProduct,
                                count: products?.[i]?.count
                            }
                        } else {
                            return cartProduct;
                        }
                    })
                }             
                
                updatedCartInDb = await global?.models?.CART.findOneAndUpdate(
                    { 
                        _id: new mongoose.Types.ObjectId(cartId),
                        customerId: new mongoose.Types.ObjectId(customer?._id)
                    },
                    {
                        products: cartProducts
                    },
                    { new: true }
                );
            } else if (action === 'clear') {
                updatedCartInDb = await global?.models?.CART.findOneAndUpdate(
                    { 
                        _id: new mongoose.Types.ObjectId(cartId),
                        customerId: new mongoose.Types.ObjectId(customer?._id)
                    },
                    {
                        products: []
                    },
                    { new: true }
                );
            };

            if (updatedCartInDb) {
                res?.status(200)?.json({
                    payload: {
                        item: updatedCartInDb
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured!`);
            }
        } catch (err) {
            console.log(err, 'updateProductsInCartError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    updateProductsInCartController
}