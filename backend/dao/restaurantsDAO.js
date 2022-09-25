import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let restaurants

export default class RestaurantDAO{
    static async injectDB(conn){
        if(restaurants){
            return
        }
        try{
            // console.log("hii")
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants");
            // console.log("hey")
        }catch(e){
            console.error(`Unable to establish a connection handle in restaurantsDAO:${e}`)
        }
    }
    static async getRestaurants({
        filters=null,
        page = 0,
        restaurantsPerPage = 20
    }={}){
        let query
        if (filters){
            if("name" in filters){
                query ={$text : {$search : filters["name"]}}
            }else if ("cuisine" in filters){
                query ={"cuisine" : {$eq : filters["cuisine"]}}
            }else if("zipcode" in filters){
                query ={"address.zipcode" : {$eq : filters["zipcode"]}}
            }
        }

        let cursor

        try{
            
            cursor = await restaurants.find(query)
            // console.log("heyy")
            
        }catch(e){
            console.error(`Unable to find command,${e}`)
            return {restaurantsList : [], totalNumRestaurants:0}
        }
        // console.log("no")
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try{
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query);
            // console.log("hey")
            return {restaurantsList,totalNumRestaurants}
            
        }catch(e){
            console.error(`Unable to count cursor array or problem counting documents,${e}`)
            return {restaurantsList : [], totalNumRestaurants:0}
        }

    }

    static async getRestaurantsById(id){
        try{
            const pipeline = [
                {
                    $match : {
                        _id : new ObjectId(id)
                    }
                },    
                     {
                        $lookup  :{
                            from : "reviews",
                            let : {
                                id : "$_id"
                            },
                            pipeline :[
                                {
                                    $match :{
                                        $expr :{
                                            $eq:["$restaurant_id","$$id"],
                                        },
                                    },
                                },
                                {
                                    $sort : {
                                        date : -1
                                    },
                                },
                            ],
                            as : "reviews"
                        },
                     },
                     {
                        $addFields : {
                            reviews : "$reviews",
                        },
                     },
            ]
            return await restaurants.aggregate(pipeline).next()
        }catch(e){
            console.error(`api,${e}`)
        }
    }

    static async getCuisine(){
        let cuisines = []
        try {
            cuisines.push(await restaurants.distinct("cuisine"))
            return cuisines
        }catch(e){
            console.error(`Unable to use cuisines,${e}`)
            return cuisines
        }
    }
}