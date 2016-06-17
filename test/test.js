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
  })
});