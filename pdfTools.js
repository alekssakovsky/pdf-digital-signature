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
 * @return {Promise<string>}
 * a promise that returns full file name if resolved
 * a promise that returns error if rejected
 * @resolve {string} fileNameForSave
 * @reject {string} errorStr
 */
function savePDFs(url, customer) {
  return new Promise((resolve, reject) => {
    const cmd = `casperjs casper-script.js "${url}" "${customer}"`;
    exec(cmd, (error, stdout, stderr) => {
      if (
        !fs.existsSync(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${customer} 1.pdf`) &&
        !fs.existsSync(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${customer} 2.pdf`) &&
        !fs.existsSync(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${customer} 3.pdf`)
      ) {
        const errStr = `Warning! I can't merge PDF files:\n${stderr}\n${stderr}\n${stdout}`;
        reject(errStr);
      } else {
        console.log('write PDF file is done');
        let files = [];
        for (let index = 1; index < 4; index++) {
          files.push(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${customer} ${index}.pdf`);
        }
        const fileNameForSave = `${customer}.pdf`;
        merge(files, `./${CONFIG.PATH_TO_TEMPS_PDFs}/${fileNameForSave}`, (error) => {
          if (error) {
            const errorStr = `I can\'t merging files: ${error}`;
            reject(errorStr);
          } else {
            resolve(fileNameForSave);
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
    const entryPoint = './';//TODO maybe need a fast paths
    if (!fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}/${CONFIG.P12_CERTIFICATE}`)
      && !fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}/${CONFIG.PASSWORD_FILE}`)) {
      const errStr = 'Warning! Certificate or Password file doesn\'t exists';
      reject(errStr);
    }
    if (!fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_TEMPS_PDFs}`)) {
      fs.mkdir(`${entryPoint}${CONFIG.PATH_TO_TEMPS_PDFs}`, (error) => {
        const errStr = `Warning! I can\'t create ${entryPoint}${CONFIG.PATH_TO_TEMPS_PDFs}\n${error}`;
        reject(errStr);
      });
    }
    if (!fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}`)) {
      fs.mkdir(`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}`, (error) => {
        const errStr = `Warning! I can\'t create \`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}\n${error}`;
        reject(errStr);
      });
    }
      resolve();
  });
}

/**
 * Adds an electronic digital signature to the file.
 *
 * @param {string} sourceFile
 *
 * @return {Promise}
 * a promise that returns object with path an fileName if resolved
 * a promise that returns error if rejected
 * @resolve {object}
 * @typedef {Object}
 * @property {string} pathFile
 * @property {string} fileName
 * @reject {string} error

 */
function signPDF(sourceFile) {
  return new Promise((resolve, reject) => {
    const cmd = `java -jar signer\\PortableSigner.jar -n \
    -s "${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}\\${CONFIG.P12_CERTIFICATE}" \
    -pwdfile "${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}\\${CONFIG.PASSWORD_FILE}" \
    -t "${CONFIG.PATH_TO_TEMPS_PDFs}\\${sourceFile}" -o "${CONFIG.PATH_TO_SIGNED_PDF}\\${sourceFile}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (fs.existsSync(`./${CONFIG.PATH_TO_SIGNED_PDF}/${sourceFile}`)) {
        console.log('signing PDF file is done');
        resolve({
          pathFile: `./${CONFIG.PATH_TO_SIGNED_PDF}/`,
          fileName: sourceFile
        });
        fs.unlink(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${sourceFile}`, (error) => {
          if (error) {
            console.error(`I cant delete source file: ./${CONFIG.PATH_TO_TEMPS_PDFs}/${sourceFile}`);
          }
        });
      }
      else {
        const errStr = `Warning! I can\'t sign PDF file:\n${stderr}\n${stderr}\n${stdout}`;
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
      .catch((error) => reject(error))
      .then(() => {
        savePDFs(url, customer)
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
