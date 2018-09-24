const fs = require('fs');
const AWS = require('aws-sdk');
const AWS_CONFIG = require('./config/S3.json').client;
const s3 = new AWS.S3(AWS_CONFIG);

/**
 * Uploads file in AWS S3 Service.
 *
 * @param {object} fileDefinition
 * @param {string} fileDefinition.pathFile
 * @param {string} fileDefinition.fileName
 *
 * @return {Promise}
 * a promise that returns file's id  if resolved
 * a promise that returns error if rejected
 * @resolve {string} data
 * @reject {string} err
 */
function uploadFile(fileDefinition) {

  return new Promise((resolve, reject) => {
    const param = {
      Bucket: AWS_CONFIG.bucketName,
      ACL: 'public-read',
      Key: fileDefinition.fileName,
      ContentType: 'binary',
      Body: fs.createReadStream(`${fileDefinition.pathFile}${fileDefinition.fileName}`)
    };

    s3.upload(param, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data);
    });
  });
}


// uploadFile({
//   pathFile: './',
//   fileName: '111.md'
// })
//   .then(data => console.log(data))
//   .catch(err => console.log(err));


module.exports.uploadFile = uploadFile;