const fs = require('fs');
const AWS = require('aws-sdk');
const AWS_CONFIG = require('./config/S3.json');
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
    fs.readFile(`${fileDefinition.pathFile}${fileDefinition.fileName}`, (error, fileData) => {
      if (error) {
        const errorStr = `Can\'t upload file on S3 Service, file ${fileDefinition.pathFile}${fileDefinition.fileName} not found: ${error}`;
        reject(errorStr);
      }
      const param = {
        Bucket: AWS_CONFIG.bucketName,
        ACL: 'public-read',
        Key: fileDefinition.fileName,
        ContentType: 'application/pdf',
        Body: fileData
      };
      s3.upload(param, (error, data) => {
        if (error || data === undefined) {
          const errorStr = `Can\'t upload file on S3 Service: ${error}`;
          reject(errorStr);
        } else {
          resolve(data.Location);
          console.info(`Sent to Amazon S3. Link: ${data.Location}`);
        }

      });
    });
  });

}

module.exports.uploadFile = uploadFile;