const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListeningSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: {
      type: String,
      default:
        "listingimage",
    },
    url: {
        type: String,
        default: "https://i.ibb.co/VmcCjbP/9.png",
        set: (v) => (v === "" ? "https://i.ibb.co/VmcCjbP/9.png" : v), },
  },
  price: Number,
  location: String,
  country: String,
});                                           


const Listing = mongoose.model("Listing", ListeningSchema);
module.exports = Listing;
