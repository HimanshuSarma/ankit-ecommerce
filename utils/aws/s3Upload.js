const path = require('path');
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {
    getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_S3_REGION // this is the region that you select in AWS account
});

const uploadToS3 = (fileData) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${Date.now()?.toString()}.jpg`,
            Body: fileData
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

// function to sanitize files and send error for unsupported files
// function sanitizeFile(file, cb) {
//     // Define the allowed extension
//     const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

//     // Check allowed extensions
//     const isAllowedExt = fileExts.includes(
//         path.extname(file.originalname.toLowerCase())
//     );

//     // Mime type must be an image
//     const isAllowedMimeType = file.mimetype.startsWith("image/");

//     if (isAllowedExt && isAllowedMimeType) {
//         return cb(null, true); // no errors
//     } else {
//         // pass error msg to callback, which can be displaye in frontend
//         cb("Error: File type not allowed!");
//     }
// };

module.exports = {
    // uploadImage,
    // uploadMediaFile,
    // uploadImage
    uploadToS3,
    // createPresignedUrlWithClient
}