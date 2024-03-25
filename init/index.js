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
        //instead of adding an owner to every object we use map function t create a new property of owner.......db
        initData.data =initData.data.map((obj)=>({...obj,owner :'66011b1408895bf88fb21db7'}));

        await listing.insertMany(initData.data);
        console.log("data initialized");
    };

    initdb();