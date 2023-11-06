const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
var cors = require("cors");
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

// digitalTech
//Z6e9PiqJq3bLHchh

//****************************************************** */

const uri =
  "mongodb+srv://digitalTech:Z6e9PiqJq3bLHchh@cluster0.r0kjzd3.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("digitalDB").collection("brands");
    const brandDetails = client.db("digitalDB").collection("brandDetails");
    const cartCollection = client.db("digitalDB").collection("cartData");
    const customerCollection = client.db("digitalDB").collection("customers");

    // --01  get brand info name and image
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // --02  specific data load by id

    app.get("/branddetails", async (req, res) => {
      const cursor = brandDetails.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // --03 find a data by specific id

    app.get("/branddetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandDetails.findOne(query);
      res.send(result);
    });

    // --04 add products
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await brandDetails.insertOne(newProduct);
      res.send(result);
    });

    //--05 cart data post
    app.post("/addcart", async (req, res) => {
      const data = req.body;
      const query = { productId: data.productId };
      const alreadyExist = await cartCollection.findOne(query);

      if (alreadyExist) {
        return res
          .status(400)
          .json({ error: "Item already exists in the database" });
      } else {
        const result = await cartCollection.insertOne(data);
        console.log(result);
        res.send(result);
      }
    });

    //--06 get cart data

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // --07 update product

    app.put("/branddetails/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUser = {
        $set: {
          Image: user.Image,
          Name: user.Name,
          Price: user.Price,
        },
      };
      const result = await brandDetails.updateOne(filter, updatedUser, options);
      res.send(result);
    });

    //--08 customers review
    app.get("/customers", async (req, res) => {
      const cursor = customerCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//****************************************************** */

app.get("/", (req, res) => {
  res.send("This is digital tech server side ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
