# b64img_thumb
Read a thumbnail of the image in base64 format

## Installation

`$ npm install b64img_thumb`

## Example

```javascript
var thumb = require('b64img_thumb');
thumb(tgtDirectoryPath).then((result) => {
  console.log(result); // base64 string
});
```

### Licence

MIT