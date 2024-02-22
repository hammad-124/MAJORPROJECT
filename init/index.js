let mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  
  };
  main().then(()=>{
    console.log("connect to mongoose"); 
})
    .catch((err) => console.log(err)
    );

    const initdb = async ()=> {
        await listing.deleteMany({});
        await listing.insertMany(initData.data);
        console.log("data initialized");
    };

    initdb();