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
    const productsCollection = client.db("digitalDB").collection("products");

    // --01  get brand info name and image
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // --02  brand details of products

    app.get("/branddetails", async (req, res) => {
      const cursor = brandDetails.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // --03 find a data by specific id

    app.get("/branddetails/:id",async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await  brandDetails.findOne(query);
      res.send(result)
    })


    // --04 add products
    app.post("/products",async(req,res)=>{
      const newProduct=req.body;
      const result=await productsCollection.insertOne(newProduct);
      res.send(result)

    })

     

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
  res.send("HThis is digital tech server side ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
