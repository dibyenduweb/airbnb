const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listeningSchema = new Schema({
  title: {
    type:String,
    require:true,
  },
  description: String,
  Image: {
    type:String,
    default:
      "https://i.ibb.co/VmcCjbP/9.png",
    set:(v) => v === "" ? "https://i.ibb.co/VmcCjbP/9.png" : v,

  },
  price: Number,
  location: String,
  country: String,
});



const Listing = mongoose.model("Listing", listeningSchema);
module.exports = Listing;


