'use strict';
const merge = require('easy-pdf-merge');
const fs = require('fs');
const async = require('async');
const exec = require('child_process').exec;
const CONFIG = require('./config/PDF-sign');

/**
 * function make merging source files in 1 file and deleting source files
 * @param url
 * @param customer
 * @return {Promise<string>}
 */
function savePDFs(url, customer) {
  return new Promise((resolve, reject) => {
    const cmd = `casperjs casper-script.js "${url}" "${customer}"`;
    exec(cmd, (err, stdout, stderr) => {
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
        merge(files, `./${CONFIG.PATH_TO_TEMPS_PDFs}/${fileNameForSave}`, (err) => {
          if (err) {
            const errorStr = `I can\'t merging files: ${err}`;
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
 * function checks exists files certificate and password file
 * also it checks exists directories TEMP and Signed
 * if it's doesn't exists function try it create
 * @return {Promise<string>}
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
      fs.mkdir(`${entryPoint}${CONFIG.PATH_TO_TEMPS_PDFs}`, (err) => {
        const errStr = `Warning! I can\'t create ${entryPoint}${CONFIG.PATH_TO_TEMPS_PDFs}\n${err}`;
        reject(errStr);
      });
    }
    if (!fs.existsSync(`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}`)) {
      fs.mkdir(`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}`, (err) => {
        const errStr = `Warning! I can\'t create \`${entryPoint}${CONFIG.PATH_TO_SIGNED_PDF}\n${err}`;
        reject(errStr);
      });
    }
    resolve('0');
  });
}

/**
 * function make a PDF file is signed
 * @param sourceFile
 * @return {Promise<string>}
 */
function signPDF(sourceFile) {
  return new Promise((resolve, reject) => {
    const cmd = `java -jar signer\\PortableSigner.jar -n \
    -s "${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}\\${CONFIG.P12_CERTIFICATE}" \
    -pwdfile "${CONFIG.PATH_TO_CERTIFICATE_AND_PASSWORD}\\${CONFIG.PASSWORD_FILE}" \
    -t "${CONFIG.PATH_TO_TEMPS_PDFs}\\${sourceFile}" -o "${CONFIG.PATH_TO_SIGNED_PDF}\\${sourceFile}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (fs.existsSync(`./${CONFIG.PATH_TO_SIGNED_PDF}/${sourceFile}`)) {
        console.log('signing PDF file is done');
        resolve(`./${CONFIG.PATH_TO_SIGNED_PDF}/${sourceFile}`);
        fs.unlink(`./${CONFIG.PATH_TO_TEMPS_PDFs}/${sourceFile}`, (err) => {
          if (err) {
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
 * @param url
 * @param customer
 * @return {Promise<string>}
 */
function makePDF(url, customer) {
  return new Promise((resolve, reject) => {
    checkFilesAndDirectories()
      .catch((error) => reject(error))
      .then((result) => {
        if (result === '0') {
          savePDFs(url, customer)
            .then((savedFile) => {
              signPDF(savedFile)
                .then(signedFile => resolve(signedFile))
                .catch(error => reject(error));
            })
            .catch((error) => reject(error));
        }
      });
  });
}


module.exports.makePDF = makePDF;

// makePDF('https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=', 'Arnold')
//   .then(signedFile => console.log('THEN', signedFile))
//   .catch(error => console.log('CATCH', error));

