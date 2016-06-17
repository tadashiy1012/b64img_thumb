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
  const getBase64 = function(tgtFilePath) {
    return new Promise((resolve, reject) => {
      resizeImg(
        fs.readFileSync(tgtFilePath),
        {width: 128, height: 128}
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
  return function b64imgThumb(tgtDirectory, tgtExt = ALL_EXT) {
    return new Promise((resolve, reject) => {
      getFileNames(tgtDirectory).then((data) => {
        const pAry = [];
        data.forEach((file) => {
          if (file.substring(file.lastIndexOf('.') + 1) === tgtExt || tgtExt == ALL_EXT) {
            pAry.push(checkStat(path.join(tgtDirectory, file)));
          }
        });
        return Promise.all(pAry);
      }).then((arg) => {
        const files = arg.filter(a => a[1]).map(a => a[0]);
        const pAry = [];
        files.forEach((file) => {
          pAry.push(getBase64(file));
        });
        return Promise.all(pAry);
      }).then((arg) => {
        resolve(arg.filter(a => a !== undefined));
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  };
})();