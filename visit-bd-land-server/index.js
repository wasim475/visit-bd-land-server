const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000


const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" ],
  allowedHeaders:["Content-Type"]
};



app.use(cors(corsOptions));
app.options("*",cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.r95emnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const packData = client.db('packDataDB').collection('packages')
    const bookingData = client.db('BookingDB').collection('bookings')
    const WishlistData = client.db('wishlistDB').collection('wishlist')
    const UserReviewData = client.db('UserReviewDB').collection('userReview')
    const UserStoryData = client.db('UserStoryDB').collection('userStory')
    const UserCollection = client.db('UserListDB').collection('userList')
    // const GalleryDataCollection = client.db('galleryDataDB').collection('userChoice')
    // const PurchasesDataCollection = client.db('purchaseDataDB').collection('purchase')
  
    app.get('/bookings', async(req, res)=>{
      const cursor = bookingData.find()
      const result = await cursor.toArray()
      res.send(result)
   
    })

    app.post('/bookings', async(req, res)=>{
        const bookgData = req.body;
        const result = await bookingData.insertOne(bookgData)
        res.send(result)
      })

      app.delete('/bookings/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await bookingData.deleteOne(query)
        res.send(result)
      })


    app.get('/packages', async(req, res)=>{
      const cursor = packData.find()
      const result = await cursor.toArray()
      res.send(result)
   
    })

    app.post('/packages', async(req, res)=>{
        const packagesData = req.body;
        const result = await packData.insertOne(packagesData)
        res.send(result)
      })
    app.get('/wishlist', async(req, res)=>{
      const cursor = WishlistData.find()
      const result = await cursor.toArray()
      res.send(result)
   
    })

    app.post('/wishlist', async(req, res)=>{
        const wlistData = req.body;
        const result = await WishlistData.insertOne(wlistData)
        res.send(result)
      })

      app.delete('/wishlist/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await WishlistData.deleteOne(query)
            res.send(result)
          })

          app.get('/review', async(req, res)=>{
            const cursor = UserReviewData.find()
            const result = await cursor.toArray()
            res.send(result)
         
          })
      
          app.post('/review', async(req, res)=>{
              const reviewData = req.body;
              const result = await UserReviewData.insertOne(reviewData)
              res.send(result)
            })

            app.get('/stories', async(req, res)=>{
              const cursor = UserStoryData.find()
              const result = await cursor.toArray()
              res.send(result)
           
            })
        
            app.post('/stories', async(req, res)=>{
                const storyData = req.body;
                const result = await UserStoryData.insertOne(storyData)
                res.send(result)
              })
      

              app.get('/users', async(req, res)=>{
                const cursor = UserCollection.find()
                const result = await cursor.toArray()
                res.send(result)
             
              })
          
              app.post('/users', async(req, res)=>{
                  const userData = req.body;
                  const query = {email: userData.email}
                  const existingUser = await UserCollection.findOne(query)
                  if(existingUser){
                    return res.send({message: 'user already exist.', insertedId: null})
                  }
                  const result = await UserCollection.insertOne(userData)
                  res.send(result)
                })

 

//     app.get('/userChoice', async (req, res) => {
//       const cursor = GalleryDataCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//   })

//     app.get('/purchases', async (req, res) => {
//       const cursor = PurchasesDataCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//   })

//   app.delete('/purchases/:id',async(req, res)=>{
//     const id = req.params.id;
//     const query = {_id: new ObjectId(id)}
//     const result = await PurchasesDataCollection.deleteOne(query)
//     res.send(result)
//   })
//   app.delete('/foods/:id',async(req, res)=>{
//     const id = req.params.id;
//     const query = {_id: new ObjectId(id)}
//     const result = await UserFoodDataCollection.deleteOne(query)
//     res.send(result)
//   })

//   app.get('/foods/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) }
//       const result = await UserFoodDataCollection.findOne(query);
//       res.send(result);
//   })

//   app.put('/foods/:id', async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) }
//       const options= {upsert: true}
//       const updateFoodInfo = req.body
//       const upFoodData ={
//         $set:{
//           FoodName:updateFoodInfo.FoodName,
//           FoodCategory:updateFoodInfo.FoodCategory,
//           shortDescription:updateFoodInfo.shortDescription, 
//           price:updateFoodInfo.price, 
//           countryName:updateFoodInfo.countryName, 
//           quantity:updateFoodInfo.quantity, 
//           userEmail:updateFoodInfo.userEmail, 
//           userName:updateFoodInfo.userName, 
//           photoUrl: updateFoodInfo.photoUrl
//         }
//       }
//       const result = await UserFoodDataCollection.updateOne(filter, upFoodData);
//       res.send(result);
//   })


  
    
    // app.post('/userChoice', async(req, res)=>{
    //   const galleryData = req.body;
    //   const result = await GalleryDataCollection.insertOne(galleryData)
    //   res.send(result)
    // })
    // app.post('/purchases', async(req, res)=>{
    //   const purchasesData = req.body;
    //   const result = await PurchasesDataCollection.insertOne(purchasesData);
    //   res.send(result)
    // })

   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Wellcome to visit bd land serversite')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })