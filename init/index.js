const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,      //add owner to each listing with only one fun not adding manually
    owner:'679ec88c3943f16d5c3132b8'                      //map func create a new array not make changes to old ...thats y stored in
  }));                                                 //initData.data again 

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}

initDB();



