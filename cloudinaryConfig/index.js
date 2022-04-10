const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: 'khan007',
    api_key: '391996277847715',
    api_secret: 'ZCMVL3i30Gz97w8yDefwraNWVVc'
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'jpg', 'png']
    }
});

module.exports = {
    cloudinary,
    storage
}
