const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.PAYMENT_SECRET_CODE);
require('dotenv').config()
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 3000



// const corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" ],
//   allowedHeaders:["Content-Type"]
// };

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://visit-bd-land-server.vercel.app",
//       // "https://cardoctor-bd.firebaseapp.com",
//     ]
//   })
// );
app.use(cors())


// app.use(cors(corsOptions));
// app.options("*",cors(corsOptions))
app.use(express.json())
// app.use(cors());


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
    const guideDataCollection = client.db('GuidesDB').collection('GuidesList')
    const paymentCollection = client.db('PaymentsDB').collection('Payments')
    // const GalleryDataCollection = client.db('galleryDataDB').collection('userChoice')
    // const PurchasesDataCollection = client.db('purchaseDataDB').collection('purchase')
  
    //Admin
    
    // Jwt
  
    app.post('/jwt', async(req, res)=>{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:'1h'
      });
      res.send({token})
    })

    const verifyToken = (req, res, next) => {
      // console.log('inside verify token', req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: 'No token provided' });
      }
      
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).send({ message: 'Malformed token' });
      }

      const verifyAdmin = async (req, res, next) => {
        const email = req.decoded.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        const isAdmin = user?.role === 'admin';
        if (!isAdmin) {
          return res.status(403).send({ message: 'forbidden access' });
        }
        next();
      }
    
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'Invalid token' });
        }
        req.decoded = decoded;
        next();
      });
    };
    

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

    app.post('/guides', async(req, res)=>{
        const guideData = req.body;
        const result = await guideDataCollection.insertOne(guideData)
        res.send(result)
      })

      app.get('/guides', async(req, res)=>{
        const cursor = guideDataCollection.find()
        const result = await cursor.toArray()
        res.send(result)
     
      })

      app.delete('/bookings/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await bookingData.deleteOne(query)
        res.send(result)
      })

      app.put('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateBookingsInfo = req.body;
        const upBookData = {
          $set: {
            status: updateBookingsInfo.status, // Assuming status is directly in req.body
          }
        };
    
        try {
          const result = await bookingData.updateOne(filter, upBookData, options);
          if (result.modifiedCount > 0) {
            res.send({ message: 'Booking status updated successfully' });
          } else {
            res.send({ message: 'No booking found with this id or no changes made' });
          }
        } catch (error) {
          console.error('Error updating booking status', error);
          res.status(500).send({ message: 'Internal server error' });
        }
      });


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
      
              // verifyToken
              app.get('/users', async (req, res) => {
                const page = parseInt(req.query.page) || 0; 
                const limit = parseInt(req.query.limit) || 10; 
            
                try {
                    const cursor = UserCollection.find()
                        .skip(page * limit) 
                        .limit(limit); 
            
                    const result = await cursor.toArray();
                    const totalCount = await UserCollection.countDocuments();
            
                    res.send({
                        users: result,
                        totalCount: totalCount
                    });
                } catch (error) {
                    console.error("Error fetching users:", error);
                    res.status(500).send("Internal Server Error");
                }
            });
            
          
              app.post('/users', async(req, res)=>{
                  const userData = req.body;
                  const query = {email: userData.email}
                  const existingUser = await UserCollection.findOne(query)
                  if(existingUser){
                    return res.send({message: 'user already exist', insertedId: null})
                  }
                  const result = await UserCollection.insertOne(userData)
                  res.send(result)
                })

                app.delete('/users/:id',async(req, res)=>{
                  const id = req.params.id;
                  const query = {_id: new ObjectId(id)}
                  const result = await UserCollection.deleteOne(query)
                  res.send(result)
                })

                
                app.put('/users/:email', async (req, res) => {
                  const email = req.params.email;
                  const updatedData = req.body;
                
                  try {
                    const filter = { email: email };
                    const updateDoc = {
                      $set: updatedData,
                    };
                
                    const result = await UserCollection.updateOne(filter, updateDoc);
                
                    if (result.modifiedCount > 0) {
                      res.status(200).json({ message: 'User updated successfully' });
                    } else {
                      res.status(404).json({ message: 'User not found' });
                    }
                  } catch (error) {
                    console.error('Error updating user:', error);
                    res.status(500).json({ message: 'Internal Server Error' });
                  }
                });
                

                app.patch('/users/admin/:id',async(req, res)=>{
                  const id = req.params.id;
                  const query = {_id: new ObjectId(id)}
                  const updateDoc = {
                    $set: {
                      role: "admin",
                    }
                  }
                  const result = await UserCollection.updateOne(query, updateDoc);
                  res.send(result)
                })

                app.patch('/users/guest/:id',async(req, res)=>{
                  const id = req.params.id;
                  const query = {_id: new ObjectId(id)}
                  const updateDoc = {
                    $set: {
                      role: "guest",
                    }
                  }
                  const result = await UserCollection.updateOne(query, updateDoc);
                  res.send(result)
                })
                // verifyToken
                app.get('/users/admin/:email',verifyToken, async(req,res)=>{
                  const email = req.params.email;
                  if(email !== req.decoded.email){
                    return res.status(403).send({message: "unauthorized access"})
                  }
                  const query = {email:email};
                  const user = await UserCollection.findOne(query);
                  let admin = false;
                  if(user){
                    admin = user?.role=== 'admin'
                  }
                  res.send({admin})
              })
              // verifyToken
              app.get('/users/guest/:email',verifyToken, async(req,res)=>{
                  const email = req.params.email;
                  if(email !== req.decoded.email){
                    return res.status(403).send({message: "unauthorized access"})
                  }
                  const query = {email:email};
                  const user = await UserCollection.findOne(query);
                  let isGuest = false;
                  if(user){
                    isGuest = user?.role=== 'guest'
                  }
                  res.send({isGuest})
              })


              app.post('/create-payment-intent', async (req, res) => {
                const { price } = req.body;
                const amount = parseInt(price * 100);
                console.log(amount, 'amount inside the intent')
          
                const paymentIntent = await stripe.paymentIntents.create({
                  amount: amount,
                  currency: 'usd',
                  payment_method_types: ['card']
                });
          
                res.send({
                  clientSecret: paymentIntent.client_secret
                })
              });
          
          
              app.get('/payments/:email', verifyToken, async (req, res) => {
                const query = { email: req.params.email }
                if (req.params.email !== req.decoded.email) {
                  return res.status(403).send({ message: 'forbidden access' });
                }
                const result = await paymentCollection.find(query).toArray();
                res.send(result);
              })
          
              app.post('/payments', async (req, res) => {
                const payment = req.body;
                const paymentResult = await paymentCollection.insertOne(payment);
          
                //  carefully delete each item from the cart
                console.log('payment info', payment);
                const query = {
                  _id: {
                    $in: payment.cartIds.map(id => new ObjectId(id))
                  }
                };
          
                const deleteResult = await cartCollection.deleteMany(query);
          
                res.send({ paymentResult, deleteResult });
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

  // app.put('/foods/:id', async (req, res) => {
  //     const id = req.params.id;
  //     const filter = { _id: new ObjectId(id) }
  //     const options= {upsert: true}
  //     const updateFoodInfo = req.body
  //     const upFoodData ={
  //       $set:{
  //         FoodName:updateFoodInfo.FoodName,
  //         FoodCategory:updateFoodInfo.FoodCategory,
  //         shortDescription:updateFoodInfo.shortDescription, 
  //         price:updateFoodInfo.price, 
  //         countryName:updateFoodInfo.countryName, 
  //         quantity:updateFoodInfo.quantity, 
  //         userEmail:updateFoodInfo.userEmail, 
  //         userName:updateFoodInfo.userName, 
  //         photoUrl: updateFoodInfo.photoUrl
  //       }
  //     }
  //     const result = await UserFoodDataCollection.updateOne(filter, upFoodData);
  //     res.send(result);
  // })


  
    
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