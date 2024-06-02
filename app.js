const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const{ listingSchema } =require("./schema.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to the DB");  
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/", (req, res) => {
  res.send("Hi i am root");
});

//validation
const validateListing =(req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);

  if(error){
    throw new ExpressError(400, result.error)
  }else{
    next()
  }
}

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//Show Route
app.get("/listings/:id",wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
})
);

//Create route
app.post("/listings", wrapAsync (async(req, res, next) =>{
  let result = listingSchema.validate(req.body);
  console.log(result);
  const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("./listings");
})
);





// app.post("/listings", async (req, res, next) => {
//   try {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("./listings");
//   } catch (err) {
//     next(err);
//   }
// });


//Edit route
app.get("/listings/:id/edit",wrapAsync (async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
})
);

//Update Route
app.put("/listings/:id",wrapAsync  (async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // res.redirect("/listings");
  res.redirect(`/listings/${id}`)
}));

//Delete route

app.delete("/listings/:id",wrapAsync (async (req, res) => {
  let { id } = req.params;
  let deleteListing =await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings")
}))


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("succesful testing");
// });

// app.use((err, res, next)=> {
//   console.log("someting wrong");
//   res.send("something went wrong")

// })

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found"))
})


app.use((err, req, res, next) => {
let {statusCode=500, message="Somethin went wrong!"} =err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", {message})
});


app.listen(8080, () => {
  console.log("server is listening port 8080");
});
