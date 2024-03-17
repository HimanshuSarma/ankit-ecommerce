const mongoose = require('mongoose');

const { CategorySchema } = require('../../Schema/CategorySchema');
const { ProductSchema } = require('../../Schema/ProductSchema');
const { CartSchema } = require('../../Schema/CartSchema');
const { OrderSchema } = require('../../Schema/OrderSchema');
const { CustomerSchema } = require('../../Schema/CustomerSchema');
const { AdminSchema } = require('../../Schema/AdminSchema');
const { DeliveryPartnerSchema } = require('../../Schema/DeliveryPartnerSchema');
const { AnalyticsUserViewedProductSchema } = require('../../Schema/AnalyticsUserViewedProduct');

const createDBConnection = async () => {
    const dbConnection = mongoose.createConnection(process.env.MONGODB_URI);

    global.dbConnection = dbConnection;

    dbConnection.on('connected', async () => {
        console.log(`Database connected`);
        global.models = {
            CATEGORY: dbConnection.model('categories', CategorySchema),
            PRODUCT: dbConnection.model('products', ProductSchema),
            CART: dbConnection.model('carts', CartSchema),
            ORDER: dbConnection.model('orders', OrderSchema),
            CUSTOMER: dbConnection.model('customers', CustomerSchema),
            ADMIN: dbConnection.model('admins', AdminSchema),
            DELIVERY_PARTNER: dbConnection.model('deliveryPartners', DeliveryPartnerSchema),
            ANALYTICS_USER_VIEWED_PRODUCT: dbConnection.model('analyticsUserViewedProduct', AnalyticsUserViewedProductSchema)
        }
    });


    dbConnection.on('disconnected', () => {
        console.log(`Database disconnected`);
    });

    dbConnection.on('error', () => {
        console.log(`Database connection error`);
        process.exit();
    });
}


module.exports = {
    createDBConnection
};