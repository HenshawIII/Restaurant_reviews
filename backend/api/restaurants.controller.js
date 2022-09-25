import RestaurantDAO from "../dao/restaurantsDAO.js";

export default class RestaurantController{
    static async apiGetRestaurants(req,res,next){
        const restaurantsPerPage = req.query.restaurantsPerPage? parseInt(req.query.restaurantsPerPage,10): 20
        const page = req.query.page? parseInt(req.query.page,10) : 0    ;
        
        let filters = {}

        if(req.query.cuisine){
            filters.cuisine= req.query.cuisine
        }else if(req.query.zipcode){
            filters.zipcode = req.query.zipcode
        }else if(req.query.name){
            filters.name = req.query.name
        }

        const {restaurantsList,totalNumRestaurants} = await RestaurantDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        })

        let response = {
            restaurants : restaurantsList,
            page : page,
            filters:filters,
            entriesPerPage : restaurantsPerPage,
            totalResults : totalNumRestaurants

        }
        res.json(response)
    }

    static async apiGetRestaurantsById(req,res,next){
        try{
            let id = req.params.id || {};
            let restaurant = await RestaurantDAO.getRestaurantsById(id);
            if(!restaurant){
                res.status(404).json({error:"not found"})
                return
            }
            res.json(restaurant)
        }catch(e){
            console.log(`api, ${e}`);
            res.status(500).json({error:e})
        }
    }

    static async apiGetRestaurantsCuisines(req,res,next){
        try{
            let cuisines = await RestaurantDAO.getCuisine()
            res.json(cuisines)
        }catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error:e})

        }
    }
}