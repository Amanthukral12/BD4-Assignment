const express = require('express');
const { resolve } = require('path');
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose();
let {open} = require("sqlite")
const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());


(async () => {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  })
})();

const fetchAllRestaurants = async () => {
  let query = "select * from restaurants";
  let response = await db.all(query,[]);
  return {restaurants: response}
}

app.get("/restaurants", async(req, res) => {
  try {
    const result = await fetchAllRestaurants();
    if(result.restaurants.length === 0) {
      return res.status(404).json({message: "No Restaurants found..."})
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
  
})

const fetchRestaurantDetailsById = async (id) => {
  let query = "select * from restaurants where id=?";
  let response = await db.get(query, [id])
  return {restaurant: response}
}

app.get("/restaurants/details/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const result = await fetchRestaurantDetailsById(id);
    console.log(result)
    if(result.restaurant === undefined) {
      return res.status(404).json({message: "No Restaurant found"})
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
  
})

const fetchRestaurantsByCuisine = async (cuisine) => {
  const query = "select * from restaurants where cuisine=?";
  let response = await db.all(query, [cuisine])
  return {restaurants: response}
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    let result = await fetchRestaurantsByCuisine(cuisine);
    if(result.restaurants.length === 0) {
      return res.status(404).json({message: "No Restaurants found for the " + cuisine + " cuisine"})
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }

})

const fetchRestaurantsByFilter = async (isVeg,hasOutdoorSeating, isLuxury) => {
  const query = "select * from restaurants where isVeg=? AND hasOutdoorSeating=? AND isLuxury=?";
  const response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury])
  return {restaurants: response}
}

app.get("/restaurants/filter", async (req, res) => {
  try {
    const isVeg = req.query.isVeg
    const hasOutdoorSeating = req.query.hasOutdoorSeating
    const isLuxury = req.query.isLuxury
  
    let result = await fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);

    if(result.restaurants.length === 0) {
      return res.status(404).json({message: "No Restaurants found based on the filters..."})
    }
  
    return res.status(200).json(result)
  
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
 
})

const sortByRating = async () => {
  let query = "select * from restaurants";
  let response = await db.all(query,[]);
  response.sort((a,b) => b.rating-a.rating)
  return {restaurants: response}
}

app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    const result = await sortByRating();
    if(result.restaurants.length === 0) {
      return res.status(404).json({message: "No Restaurants found..."})
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
 
})

const fetchAllDishes = async () => {
  let query = "select * from dishes";
  let response = await db.all(query,[]);
  return {dishes: response}
}

app.get("/dishes", async(req, res) => {
  try {
    const result = await fetchAllDishes();
    if(result.dishes.length === 0) {
      return res.status(404).json({message: "No Dishes found..."})
    }
    return res.status(200).json(result)
    
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

const fetchDishesById = async (id) => {
  let query = "select * from dishes where id=?"
  let response = await db.get(query, [id])
  return {dish: response}
}

app.get("/dishes/details/:id", async (req, res) => {
  try {
    const id = parseFloat(req.params.id)
    const result = await fetchDishesById(id)
    if(result.dish === undefined) {
      return res.status(404).json({message: "No Dishes found..."})
    }
    return res.status(200).json(result)
    
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

const fetchDishesByFilter = async (isVeg) => {
  const query = "select * from dishes where isVeg=?"
  let response = await db.all(query, [isVeg])
  return {dishes: response}
}

app.get("/dishes/filter", async(req, res) => {
  try {
    const isVeg = req.query.isVeg;
    const result = await fetchDishesByFilter(isVeg);
    if(result.dishes.length === 0) {
      return res.status(404).json({message: "No Dishes found based on the filters..."})
    }
    return res.status(200).json(result)
    
  } catch (error) {
     return res.status(500).json({error: error.message})
  }
})

const sortDishesByPrice = async () => {
  const query = "select * from dishes";
  let response = await db.all(query, [])
  response.sort((a,b) => a.price - b.price)
  return {dishes: response}
}

app.get("/dishes/sort-by-price", async(req, res) => {
  try {
    const result = await sortDishesByPrice();
    if(result.dishes.length === 0) {
      return res.status(404).json({message: "No Dishes found..."})
    }
    return res.status(200).json(result)
    
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
