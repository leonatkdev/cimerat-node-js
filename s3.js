// const aws = require("aws-sdk")
// const crypto = require("crypto")

// const region = 'eu-central-1';
// const bucketName = "cimerat-photos-aws"
// const accessKeyId = process.env.AWS_ACESS_KEY_ID
// const secretAccessKey = process.env.AWS_SECRET_ACESS_KEY_ID

// // creating a s3 bucket object
// const s3 = new aws.S3({
//     region,
//     accessKeyId,
//     secretAccessKey,
//     signatureVersion: 'v4'
// })


// module.exports.generateUploadURL = async function () {
//     const rawBytes = await crypto.randomBytes(16);
//     const imageName = rawBytes.toString('hex');

//     const params = {
//         Bucket: bucketName,
//         Key: imageName,
//         Expires: 60,
//     };

//     const uploadURL = await s3.getSignedUrlPromise("putObject", params);
//     return uploadURL;
// };