const mongoose = require("mongoose");
require("dotenv").config();
const dbUri = process.env.mongoUri;

const dbConnect = async () => {
    mongoose.connect(dbUri).then((data) => {
        if (data) {
            console.log("Db connected successfully");
        }
    }).catch((err) => {
        console.log(err);
    })
}


module.exports = dbConnect;