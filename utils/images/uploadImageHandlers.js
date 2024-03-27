const { uploadToS3 } = require('../aws/s3Upload')

const uploadMultipleImagesMiddleware = async (req, res, next) => {
    console.log(req?.files);
    let areAllImagesUploaded = true;

    if (req?.files) {

        for (let i = 0; i < req?.files?.length; i++) {
            const res = await uploadToS3(req?.files?.[i]?.buffer);
            if (!res?.Location) {
                return false;
            } 
            req.files[i] = {
                ...req?.files?.[i],
                ...res
            }
            console.log(res, 'location');
        }

        return areAllImagesUploaded;
    } else return false;
};


const uploadMultipleImagesFromBodyMiddleware = async (req) => {
    let areAllImagesUploaded = true;

    if (req?.body?.images) {
        for (let i = 0; i < req?.body?.images?.length; i++) {
            const res = await uploadToS3(req?.body?.images?.[i]?.data);
            if (!res?.Location) {
                return false;
            } 
            req.body.images[i] = {
                _id: req?.body?.images?.[i]?._id,
                url: res?.Location,
                description: req?.body?.images?.[i]?.description,
            }
        }

        return areAllImagesUploaded;
    } else return false;
}

module.exports = {
    uploadMultipleImagesMiddleware,
    uploadMultipleImagesFromBodyMiddleware
}