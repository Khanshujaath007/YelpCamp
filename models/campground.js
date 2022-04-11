
const { string, func } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
})


ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    id: String,
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<a>${this.title}</a>`
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);