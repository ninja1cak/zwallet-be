const { uploader } = require('cloudinary').v2
const path = require("path");
const dataUriParser = require("datauri/parser");

// async function upload(pathFile) {
//     try {
//         let result = await uploader.upload(pathFile, {
//             folder: 'assets',
//             use_filename: true
//         })
//         return result.url
//     } catch (error) {
//         return error
//     }
// }

const upload = async (file, prefix, id) => {
    if (!file) return { secure_url: null };
    const buffer = file.buffer;
    const ext = path.extname(file.originalname).toString();
    const parser = new dataUriParser();
    const datauri = parser.format(ext, buffer);
    const timestamp = Date.now();
    const filename = `${prefix}-${file.fieldname}-${id}-${timestamp}`;
    console.log('filename', filename)
    try {
      const result = await uploader.upload(datauri.content, {
        public_id: filename,
        folder: "zwallet",
      });
      return result.url;
    } catch (err) {
      console.log(err)
      return 'Error gaess' + err;
    }
  };
  

module.exports = upload