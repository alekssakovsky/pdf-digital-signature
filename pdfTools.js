'use strict';
const merge = require('easy-pdf-merge');
const fs = require('fs');
const async = require('async');
const exec = require('child_process').exec;
const CONFIG = require('./config/PDF-sign');

/**
 * Makes merging source files in 1 file and deleting source files.
 *
 * @param {string} url
 * @param {string} customer
 *
 * @return {Promise}
 * a promise that returns full file name if resolved
 * a promise that returns error if rejected
 * @resolve {object}
 * @typedef {object}
 * @property {string} pathFile
 * @property {string} fileName
 * @reject {string} errorStr
 */
function mergePDFs(url, customer) {
  return new Promise((resolve, reject) => {
    // const cmd = `casperjs casper-script.js "${url}" "${customer}"`;
    // const cmd = `casperjs casper-script.js --customer="${customer}"`;
    const cmd = `casperjs casper-script.js --vendor="${url}" --customer="${customer}"`;
    console.info(`Go to link: ${url}${customer}`);
    exec(cmd, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
      }
      console.info(stdout);
      if (
        !fs.existsSync(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${customer} 1.pdf`) &&
        !fs.existsSync(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${customer} 2.pdf`) &&
        !fs.existsSync(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${customer} 3.pdf`)
      ) {
        const errStr = `Warning! Can't merge PDF files:\n${stderr}\n${stderr}\n${stdout}`;
        reject(errStr);
      } else {
        let files = [];
        for (let index = 1; index < 4; index++) {
          files.push(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${customer} ${index}.pdf`);
        }
        const fileNameForSave = `${customer}.pdf`;
        console.info(`Merge 3 pdf in one: ${customer}.pdf`);
        merge(files, `./${CONFIG.PATH_TO_TEMPS_PDFs}/${fileNameForSave}`, (error) => {
          if (error) {
            const errorStr = `Can\'t merging files: ${error}`;
            reject(errorStr);
          } else {
            resolve({
              pathFile: `./${CONFIG.PATH_TO_SIGNED_PDF}/`,
              fileName: fileNameForSave
            });
          }
          async.each(files, fs.unlink);
        });
      }
    });
  });
}

/**
 * Checks exists files certificate and password file
 * also it checks exists directories TEMP and Signed
 * if it's doesn't exists function try it create.
 *
 * @return {Promise<string>}
 * a promise that returns if resolved
 * a promise that returns error if rejected
 * @resolve {string}
 * @reject {string} errorStr
 */
function checkFilesAndDirectories() {
  return new Promise((resolve, reject) => {
    const entryPoint = './';
    if (!fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}/${CONFIG.P12_CERTIFICATE}`)
      && !fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}/${CONFIG.PASSWORD_FILE}`)) {
      const errStr = 'Warning! Certificate or Password file doesn\'t exists';
      reject(errStr);
    }
    if (!fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_TEMPS_PDFs}`)) {
      fs.mkdir(`${entryPoint}${CONFIG.PATH_TO_TEMPS_PDFs}`, (error) => {
        const errStr = `Warning! Can\'t create ${entryPoint}${CONFIG.PATH_TO_TEMPS_PDFs}\n${error}`;
        reject(errStr);
      });
    }
    if (!fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}`)) {
      fs.mkdir(`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}`, (error) => {
        const errStr = `Warning! Can\'t create \`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}\n${error}`;
        reject(errStr);
      });
    }
    resolve();
  });
}

/**
 * Adds an electronic digital signature to the file.
 *
 * @param {object} sourceFile
 * @param {string} sourceFile.pathFile
 * @param {string} sourceFile.fileName
 *
 * @return {Promise}
 * a promise that returns object with path an fileName if resolved
 * a promise that returns error if rejected
 * @resolve {object}
 * @typedef {object}
 * @property {string} pathFile
 * @property {string} fileName
 * @reject {string} error
 */
function signPDF(sourceFile) {
  return new Promise((resolve, reject) => {
    const cmd = `java -jar signer\\PortableSigner.jar -n \
    -s "${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}\\${CONFIG.P12_CERTIFICATE}" \
    -pwdfile "${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}\\${CONFIG.PASSWORD_FILE}" \
    -t "${CONFIG.PATH_TO_TEMPS_PDFs}\\${sourceFile.fileName}" -o "${CONFIG.PATH_TO_SIGNED_PDF}\\${sourceFile.fileName}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
      }
      if (fs.existsSync(`./${CONFIG.PATH_TO_SIGNED_PDF}/${sourceFile.fileName}`)) {
        console.info(`Sign pdf: ./${CONFIG.PATH_TO_SIGNED_PDF}/${sourceFile.fileName}`);
        resolve({
          pathFile: `./${CONFIG.PATH_TO_SIGNED_PDF}/`,
          fileName: sourceFile.fileName
        });
        fs.unlink(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${sourceFile.fileName}`, (error) => {
          if (error) {
            console.error(`Cant delete source file: ./${CONFIG.PATH_TO_TEMPS_PDFs}/${sourceFile.fileName}`);
          }
        });
      }
      else {
        const errStr = `Warning! Can\'t sign PDF file:\n${stderr}\n${stderr}\n${stdout}`;
        reject(errStr);
      }
    });
  });
}

/**
 * function - aggregator for:
 * checkFilesAndDirectories,
 * savePDFs,
 * signPDF.
 *
 * @param {string} url
 * @param {string} customer
 *
 * @return {Promise}
 * a promise that returns object fileDefinition if resolved
 * a promise that returns error if rejected
 * @resolve {object} fileDefinition
 * @typedef {Object} fileDefinition
 * @property {string} fileDefinition.pathFile
 * @property {string} fileDefinition.fileName
 * @reject {string} error
 */
function makePDF(url, customer) {
  return new Promise((resolve, reject) => {
    checkFilesAndDirectories()
      .catch(error => reject(error))
      .then(() => {
        mergePDFs(url, customer)
          .then((savedFile) => {
            signPDF(savedFile)
              .then(fileDefinition => resolve(fileDefinition))
              .catch(error => reject(error));
          })
          .catch((error) => reject(error));
      });
  });
}

module.exports.makePDF = makePDF;
