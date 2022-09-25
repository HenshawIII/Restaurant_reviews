import app from "./server.js"
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantDAO from "./dao/restaurantsDAO.js"
import ReviewsDao from "./dao/reviewsDAO.js";

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        maxPoolSize:50,
        wtimeoutMS:2500,
        useNewUrlParser:true
    }
).catch(e=>{
    console.error(e.stack)
    process.exit(1)
})
.then(async client =>{
    await RestaurantDAO.injectDB(client)
    await ReviewsDao.injectDB(client)
    app.listen(port,()=>{
        console.log(`listenin on port ${port}`)
    })
})
