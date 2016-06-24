module.exports = (function() {
  "use strict";
  const fs = require('fs');
  const path = require('path');
  const resizeImg = require('resize-img');
  const ALL_EXT = '*';
  const getFileNames = function(tgtDirPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(tgtDirPath, (err, data) => {
        if (err) { reject(err); }
        else { resolve(data); }
      })
    });
  };
  const checkStat = function(tgtFilePath) {
    return new Promise((resolve, reject) => {
      fs.stat(tgtFilePath, (err, stats) => {
        if (err) { reject(err); }
        else { resolve([tgtFilePath, stats.isFile()]); }
      });
    });
  };
  const getFileExt = function(tgtFilePath) {
    return tgtFilePath.substring(tgtFilePath.lastIndexOf('.') + 1);
  };
  const getBase64 = function(tgtFilePath, width, height) {
    return new Promise((resolve, reject) => {
      resizeImg(
        fs.readFileSync(tgtFilePath),
        {width: width, height: height}
      ).then((buf) => {
        const ext = getFileExt(tgtFilePath);
        const head = 'data:image/' + ext + ';base64,';
        const b64 = head + buf.toString('base64');
        resolve(b64);
      }).catch((err) => {
        if (err.message === 'Image format not supported') {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  };
  return function b64imgThumb(tgtDirectory, options = {
     ext: ALL_EXT, width: 100, height: 100
  }) {
    return new Promise((resolve, reject) => {
      getFileNames(tgtDirectory).then((data) => {
        const pAry = [];
        data.forEach((file) => {
          if (file.substring(file.lastIndexOf('.') + 1) === options.ext 
          || options.ext === ALL_EXT) {
            pAry.push(checkStat(path.join(tgtDirectory, file)));
          }
        });
        return Promise.all(pAry);
      }).then((arg) => {
        const files = arg.filter(a => a[1]).map(a => a[0]);
        const pAry = [];
        files.forEach((file) => {
          pAry.push(getBase64(file, options.width, options.height));
        });
        return Promise.all(pAry);
      }).then((arg) => {
        resolve(arg.filter(a => a !== undefined));
      }).catch((err) => {
        reject(err);
      });
    });
  };
})();