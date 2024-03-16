const path = require('path');
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {
    getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");
const axios = require('axios').default;

// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env
        .AWS_SECRET_ACCESS_KEY,
    },
});

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_S3_REGION // this is the region that you select in AWS account
});


const uploadImage = multer({
    // storage: s3Client,
    // fileFilter: (req, file, callback) => {
    //     sanitizeFile(file, callback)
    // },
    limits: {
        fileSize: 1024 * 1024 * 5 // 2mb file size
    }
    // dest: path.join(__dirname, '../../uploads')
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

const uploadImageMiddleware = async (req, res, next) => {
    console.log(req?.file);

    if (req?.file) {
        const res = await uploadToS3(req?.file?.buffer);
    }
}

// const s3Storage = multerS3({
//     s3, // s3 instance
//     bucket: process.env.AWS_S3_BUCKET, // change it as per your project requirement
//     acl: "public-read", // storage access type,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: (req, file, cb) => {
//         cb(null, {fieldname: file.fieldname})
//     },
//     key: (req, file, cb) => {
//         const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
//         cb(null, fileName);
//     }
// });

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

// our middleware


// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//       fileSize: 5 * 1024 * 1024, // limit file size to 5MB
//     },
// });

// const uploadImage = async ({
//     content,
//     key,
//     contentType
// }) => {
//     const command = new PutObjectCommand({
//       Body: content,
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: key,
//       ContentType: contentType,
//     });
  
//     await s3Client.send(command);
// };

const createPresignedUrlWithClient = ({ bucket, key }) => {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

// const uploadMediaFile = async ({
//     file
// }) => {
//     // const command = new PutObjectCommand({
//     //     Body: content,
//     //     Bucket: process.env.AWS_S3_BUCKET,
//     //     Key: key,
//     //     ContentType: contentType,
//     // });

//     const signedUrl = createPresignedUrlWithClient({ 
//         bucket: process.env.AWS_S3_BUCKET,
//         key: file?.name
//     });

//     const res = await axios.put(signedUrl, 'ABC');

//     console.log('response');
  
//     // await s3Client.send(command);
// };

module.exports = {
    // uploadImage,
    // uploadMediaFile,
    // uploadImage
    uploadImage,
    uploadImageMiddleware
    // createPresignedUrlWithClient
}