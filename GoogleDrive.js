'use strict';
const fs = require('fs');
const readLine = require('readline');
const {google} = require('googleapis');
const async = require('async');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const CREDENTIALS = './config/client_secret.json';
const TOKEN = './config/token.json';


/**
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
   * @typedef {Object} Credentials
   * @property {string} client_id
   * @property {string} project_id
   * @property {string} auth_uri
   * @property {string} token_uri
   * @property {string} auth_provider_x509_cert_url
   * @property {string} client_secret
   * @property {[]} redirect_uris@param
   *
   * @return {Credentials}
   */
  static readSecretFile() {
    try {
      return require(CREDENTIALS);
    } catch (err) {
      console.error('Error loading secret file: ', err);
    }
  }

  /**
   * @return {Promise}
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
   * @typedef {Object} token
   * @property {(string)} access_token
   * @property {(string)} refresh_token
   * @property {(string)} scope
   * @property {(string)} token_type
   * @property {(number)} expiry_date
   *
   * @return {Promise<Credentials>}
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
        this.oAuth2Client.getToken(code, (err, token) => {
          if (err) {
            console.error(err);
            return;
          }

          this.oAuth2Client.setCredentials(token);
          this.drive = google.drive({version: 'v3', auth: this.oAuth2Client});
          resolve(token);
          fs.writeFile(TOKEN, JSON.stringify(token), (err) => {
            console.log('Write file TOKEN: ', err || TOKEN);
          });
        });
      });
    });
  }


  /**
   * @param {string} fileNamePdf
   *
   * @return {Promise<string>}
   */
  insertPdfFile(fileNamePdf) {
    return new Promise((resolve, reject) => {
      let that = this;
      const fileMetadataPdf = {
        'name': fileNamePdf,
      };

      const mediaPdf = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(`./Signed Files/${fileNamePdf}`)
      };
      this.drive.files.create({
        resource: fileMetadataPdf,
        media: mediaPdf,
      }, function (err, response) {
        if (err) {
          reject(err);
          console.error(err);
        }
        else {
          resolve(response.data.id);
        }
      });
    });
  }


  /**
   * @param fileNameId
   */
  grantWriteSheetFilePermission(fileNameId) {
    let that = this;
    const permissions = [
      {
        'type': 'anyone',
        'role': 'writer',
      },
    ];

    async.eachSeries(permissions, function (permission, permissionCallback) {
      that.drive.permissions.create({
        resource: permission,
        fileId: fileNameId,
      }, (err) => {
        if (err) {
          console.error(err);
        } else {
          const referenceFile = `https://docs.google.com/spreadsheets/d/${fileNameId}/edit?usp=sharing`;
          console.log('All permissions inserted, the file is accessible by reference: ', referenceFile);
          permissionCallback();
        }
      });
    }, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
}


module.exports.GoogleDrive = GoogleDrive;



let googleDrive = new GoogleDrive();

googleDrive.getToken()
  .then(() => {
    googleDrive.insertPdfFile(`Arnold.pdf`)
      .then((fileId) => {
          googleDrive.grantWriteSheetFilePermission(fileId);
    });
  });
