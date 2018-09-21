'use strict';
const fs = require('fs');
const readLine = require('readline');
const {google} = require('googleapis');
const async = require('async');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const CREDENTIALS = './config/client_secret.json';
const TOKEN = './config/token.json';


/**
 * Needs for for uploads file on Google Drive.
 *
 * @class
 */
class GoogleDrive {

  constructor() {
    this.credentials = GoogleDrive.readSecretFile();
    this.oAuth2Client = new google.auth.OAuth2(
      this.credentials.installed.client_id,
      this.credentials.installed.client_secret,
      this.credentials.installed.redirect_uris[0],
    );

    new Promise((resolve) => {
      resolve(this);
    });
  }

  /**
   * Reads file credentials.
   *
   * @return {Credentials}
   * @typedef {Object} Credentials
   * @property {string} client_id
   * @property {string} project_id
   * @property {string} auth_uri
   * @property {string} token_uri
   * @property {string} auth_provider_x509_cert_url
   * @property {string} client_secret
   * @property {[]} redirect_uris@param
   */
  static readSecretFile() {
    try {
      return require(CREDENTIALS);
    } catch (error) {
      console.error('Error loading secret file: ', error);
    }
  }

  /**
   * Checks token.
   * If token no valid return function getNewToken.
   *
   * @return {getNewToken}
   * @property {function}
   * @return {Promise}
   * @resolved
   * @property resolve
   */
  getToken() {
    if (fs.existsSync(TOKEN) && fs.statSync(TOKEN).size > 0) {
      this.oAuth2Client.setCredentials(require(TOKEN));
      this.drive = google.drive({version: 'v3', auth: this.oAuth2Client});
    } else {
      return this.getNewToken();
    }

    return Promise.resolve();
  }

  /**
   * Goes on Google is authorized by method auth2
   * and write file token.json.
   *
   * @typedef {Object} token
   * @property {string} access_token
   * @property {string} refresh_token
   * @property {string} scope
   * @property {string} token_type
   * @property {number} expiry_date
   *
   * @return {Promise<Credentials>}
   * @typedef {Object} Credentials
   * @property {string} client_id
   * @property {string} project_id
   * @property {string} auth_uri
   * @property {string} token_uri
   * @property {string} auth_provider_x509_cert_url
   * @property {string} client_secret
   * @property {[]} redirect_uris@param
   */
  getNewToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        this.oAuth2Client.getToken(code, (error, token) => {
          if (error) {
            console.error(error);
            return;
          }

          this.oAuth2Client.setCredentials(token);
          this.drive = google.drive({version: 'v3', auth: this.oAuth2Client});
          resolve(token);
          fs.writeFile(TOKEN, JSON.stringify(token), (error) => {
            console.log('Write file TOKEN: ', error || TOKEN);
          });
        });
      });
    });
  }

  /**
   * Uploads file in Google Drive.
   *
   * @param {object} fileDefinition
   * @param {string} fileDefinition.pathFile
   * @param {string} fileDefinition.fileName
   *
   * @return {Promise}
   * a promise that returns file's id  if resolved
   * a promise that returns error if rejected
   * @resolve {string} response.data.id
   * @reject {string} error
   */
  insertPdfFile(fileDefinition) {
    return new Promise((resolve, reject) => {
      const fileMetadataPdf = {
        'name': fileDefinition.fileName,
      };

      const mediaPdf = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(`${fileDefinition.pathFile}${fileDefinition.fileName}`)
      };
      this.drive.files.create({
        resource: fileMetadataPdf,
        media: mediaPdf,
      }, function (error, response) {
        if (error) {
          reject(error);
          console.error(error);
        }
        else {
          resolve(response.data.id);
        }
      });
    });
  }

  /**
   * Enables full access by reference {referenceFile}.
   *
   * @param {string} fileNameId
   *
   * @return {Promise}
   * a promise that returns referenceFile - link if resolved
   * @resolve {string} referenceFile
   */
  grantWriteSheetFilePermission(fileNameId) {
    let that = this;
    const permissions = [
      {
        'type': 'anyone',
        'role': 'writer',
      },
    ];

    return new Promise ((resolve) => {
      async.eachSeries(permissions, function (permission, permissionCallback) {
        that.drive.permissions.create({
          resource: permission,
          fileId: fileNameId,
        }, (error) => {
          if (error) {
            console.error(error);
          } else {
            const referenceFile = `https://docs.google.com/spreadsheets/d/${fileNameId}/edit?usp=sharing`;
            permissionCallback();
            resolve(referenceFile);

          }
        });
      }, (error) => {
        if (error) {
          console.error(error);
        }
      });
    });

  }
}

module.exports.GoogleDrive = GoogleDrive;