const assert = require('power-assert');
const thumb = require('../index.js');

describe('b64img_thumb test', () => {
  it('test1', (done) => {
    thumb().then((result) => {
      assert(result === true);
      done();
    });
  })
});