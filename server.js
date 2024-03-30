const express = require("express");
const fetch = require("node-fetch");
const app = express();

const urlGet = "https://api.mercadolibre.com/sites/MLA/search"
const urlDetail = "https://api.mercadolibre.com/items"

app.get("/api/items", async (req, res) => {
    const searchValue = req.query.search;
    try {
    const results = await fetch(`${urlGet}?q=${searchValue}`);
    const resultsJson = await results.json()

    const resultsMapped = resultsJson.results.map(product => ({
        id: product.id,
        title: product.title,
        price: {
            currency: product.currency_id,
            amount: product.price,
            decimals: 1,
        },
        picture: product.thumbnail,
        condition: product.condition,
        free_shipping: product.shipping.free_shipping,
    }));

    const categoriesMapped = resultsJson.results.map(product => product.category_id)

    const responseData = {
        author: {
            name: "Estiven",
            lastname: "Cardenas Otero"
        },
        categories: [...new Set(categoriesMapped)],
        items: [...resultsMapped],
    }

    return res.json(responseData);
    } catch (e) {
        console.log(e)
        throw new Error("Something went wrong while requesting the information")
    }
});

app.get("/api/items/:id", async (req, res) => {
    const id = req.params.id;
   try {
       const productDeatil = await fetch(`${urlDetail}/${id}`);
       const productDeatilJson = await productDeatil.json()

       const productDescription = await fetch(`${urlDetail}/${id}/description`);
       const productDescriptionJson = await productDescription.json()

       const formatData = {
           author: {
               name: "Estiven",
               lastname: "Cardenas Otero"
           },
           item: {
               id: productDeatilJson.id,
               title: productDeatilJson.title,
               price: {
                   currency: productDeatilJson.currency_id,
                   amount: productDeatilJson.price,
                   decimals: 1,
               },
               category: productDeatilJson.category_id,
               picture: productDeatilJson.thumbnail,
               condition: productDeatilJson.condition,
               free_shipping: productDeatilJson.shipping.free_shipping,
               sold_quantity: productDeatilJson.initial_quantity,
               description: productDescriptionJson.text,
           }
       }
       res.json(formatData)

   } catch (e) {
       console.log(e)
       throw new Error("Something went wrong while requesting the information")
   }
});


app.listen(5000, () => console.log("Server started on port 5000"))