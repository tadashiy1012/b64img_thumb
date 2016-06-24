const path = require('path');
const assert = require('power-assert');
const thumb = require('../index.js');

const testPicDir = path.join(__dirname, 'test_image');

describe('b64img_thumb test', () => {
  it('test1', (done) => {
    thumb(testPicDir).then((result) => {
      assert(result !== undefined);
      done();
    });
  });
  it('test2', (done) => {
    const opt = {
      ext: 'jpg',
      width: 50,
      height: 50
    };
    thumb(testPicDir, opt).then((resp) => {
      assert(resp !== undefined);
      done();
    });
  });
  it('test3', (done) => {
    thumb().catch((err) => {
      assert(err !== undefined);
      done();
    });
  });
});