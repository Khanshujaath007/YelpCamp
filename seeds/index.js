const mongoose = require('mongoose');
const campground = require('../models/campground');
const Campgrounds = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const incities = require('./incities');
const stringcities = JSON.stringify(incities);
const parsedcities = JSON.parse(stringcities)
//const parsedcities = eval(stringcities);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
    // useNewUrlPraser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campgrounds.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random100 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 30) + 20;
        const camp = new campground({
            author: "62539e5815da88f1d4ff3409",
            location: `${parsedcities[random100].city}, ${parsedcities[random100].admin_name}`,
            // location: `${parsedcities[random1000].city}, ${parsedcities[random1000].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi dolor, nihil error consequuntur labore iusto sed tempora qui quidem autem, enim blanditiis! Nobis voluptatum perspiciatis minus qui tenetur quasi impedit',
            geometry: {
                type: "Point",
                coordinates: [parsedcities[random100].lng, parsedcities[random100].lat]
            },
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468599/YelpCamp/wlwfcvq073euplcp44fp.jpg',
                    filename: 'YelpCamp/wlwfcvq073euplcp44fp'
                },
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468623/YelpCamp/jmoht5vxibiyfmx3nyxc.jpg',
                    filename: 'YelpCamp/jmoht5vxibiyfmx3nyxc'

                },
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468624/YelpCamp/nf1j8y75lcbjy9fwt2ip.jpg',
                    filename: 'YelpCamp/nf1j8y75lcbjy9fwt2ip',

                },
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468626/YelpCamp/tnogfobw7urziakpqpqs.jpg',
                    filename: 'YelpCamp/tnogfobw7urziakpqpqs',

                },
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468629/YelpCamp/z5t8aj8vimlpuz7ogdd9.jpg',
                    filename: 'YelpCamp/z5t8aj8vimlpuz7ogdd9',

                },
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468631/YelpCamp/fbkeemjyt7tboxhki0ve.jpg',
                    filename: 'YelpCamp/fbkeemjyt7tboxhki0ve',

                },
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468633/YelpCamp/g1wgq6mvp8ulj7o0dgtk.jpg',
                    filename: 'YelpCamp/g1wgq6mvp8ulj7o0dgtk',

                },
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468636/YelpCamp/pvus9ybbsmlf3bx2ebqa.jpg',
                    filename: 'YelpCamp/pvus9ybbsmlf3bx2ebqa',

                },
                {
                    url: 'https://res.cloudinary.com/khan007/image/upload/v1646468637/YelpCamp/nlxncxls5kmeh5onsdvl.jpg',
                    filename: 'YelpCamp/nlxncxls5kmeh5onsdvl',

                }
            ],

        })
        await camp.save();

    }

}
seedDB().then(() => {
    mongoose.connection.close();
})






