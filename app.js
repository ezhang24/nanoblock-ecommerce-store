/**
 * Name: Emily Zhang
 * Date: June 2nd, 2023
 *
 * This is the javascript file that defines the API endpoints to my
 * e-commerce store site.
 * API Documentation: https://documenter.getpostman.com/view/27732638/2s93sc4CnD
 *
 */

"use strict";
// Load required modules
const fs = require("fs/promises");
const express = require("express");
const multer = require("multer");

const SERVER_ERROR = "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEBUG = false;
const PORT_NUMBER = 8000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

// Routes and other middleware functions
app.use(express.static("public"));

// GET request for all products. More details on Postman documentation.
app.get("/products", async (req, res, next) => {
    try {
        res.type("json");
        const products = await fs.readFile("public/products.json", "utf8");
        res.send(products);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// GET request for cart items.
app.get("/cart", async (req, res, next) => {
    try {
        const cart = await fs.readFile("public/cart.json", "utf8");
        res.send(cart);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// GET request for a single product information.
app.get("/product", async (req, res, next) => {
    try {
        let name = req.query["name"];
        if (!name) {
            res.status(CLIENT_ERR_CODE);
            next(Error("Missing GET parameter: name"));
        }
        let product = await getProduct(name);
        res.send(product);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// GET request for products in a specific category.
app.get("/category", async (req, res, next) => {
    try {
        let category = req.query["category"];
        if (!category) {
            res.status(CLIENT_ERR_CODE);
            next(Error("Missing GET parameter: category"));
        }
        let products = await fs.readFile("public/products.json", "utf8");
        products = JSON.parse(products)["products"];
        let items = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i]["category"] === category) {
                items.push(products[i]);
            }
        }
        res.send(items);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// GET request for FAQ.
app.get("/faq", async (req, res, next) => {
    try {
        const faq = await fs.readFile("public/faq.json", "utf8");
        res.send(faq);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// POST request for contact page.
app.post("/contact", async (req, res, next) => {
    res.type("text");
    let name = req.body.name;
    let email = req.body.email;
    let question = req.body.question;
    if (!(name && email && question)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Missing POST parameter: name, email, and/or question"));
    }
    let result = `Name: ${name}\nEmail: ${email}\nQuestion: ${question}\n\n`;
    try {
        await fs.appendFile("public/contact.txt", result, "utf8");
        res.send("Form successfully received! We'll get back to you as soon as possible.");
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// POST request for rewards sign up.
app.post("/rewards", async (req, res, next) => {
    res.type("text");
    let name = req.body.name;
    let email = req.body.email;
    let number = req.body.number;
    if (!(name && email && number)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Missing POST parameter: name, email, and/or number"));
    }
    let result = { "name" : name, "email" : email, "number" : number };
    try {
        let members = await fs.readFile("public/rewards.json", "utf8");
        members = JSON.parse(members)["members"];
        members.push(result);
        await fs.writeFile("public/rewards.json", JSON.stringify({ "members" : members }), "utf8");
        res.send("Successfully signed up as a loyal member. Welcome to the Nano Zone!");
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// POST request for adding an item to the cart.
app.post("/addProduct", async (req, res, next) => {
    res.type("text");
    let name = req.body.name;
    try {
        let product = await getProduct(name);
        let cart = await fs.readFile("public/cart.json", "utf8");
        let isInCart = false;
        cart = JSON.parse(cart)["cart"];
        for (let i = 0; i < cart.length; i++) {
            if (cart[i]["name"] === name) {
                cart[i]["quantity"] += 1;
                isInCart = true;
                await fs.writeFile("public/cart.json", JSON.stringify({ "cart" : cart }), "utf8");
                res.send("Added item to cart!");
            }
        }
        if (!isInCart) {
            product["quantity"] = 1;
            cart.push(product);
            await fs.writeFile("public/cart.json", JSON.stringify({ "cart" : cart }), "utf8");
            res.send("Added item to cart!");
        }
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// POST request for removing an item from the cart.
app.post("/removeProduct", async (req, res, next) => {
    res.type("text");
    let name = req.body.name;
    try {
        let cart = await fs.readFile("public/cart.json", "utf8");
        let idx = -1;
        cart = JSON.parse(cart)["cart"];
        for (let i = 0; i < cart.length; i++) {
            if (cart[i]["name"] === name) {
                idx = i;
            }
        }
        if (idx === 0) {
            cart.shift();
        } else {
            cart.splice(idx, idx);
        }
        await fs.writeFile("public/cart.json", JSON.stringify({ "cart" : cart }), "utf8");
        res.send("Removed item from cart!");
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**
 * Helper function to retrieve the JSON data of a specific product name.
 * @param {String} name - String holding the product name.
 * @return {JSON Object} - JSON object of a specific product.
 */
async function getProduct(name) {
    let products = await fs.readFile("public/products.json", "utf8");
    products = JSON.parse(products)["products"];
    for (let i = 0; i < products.length; i++) {
        if (products[i]["name"] === name) {
            return products[i];
        }
    }
}

/**
 * Error-handling middleware to cleanly handle different types of errors.
 * Any function that calls next with an Error object will hit this error-handling
 * middleware.
 */
function errorHandler(err, req, res, next) {
    if (DEBUG) {
        console.error(err);
    }
    res.type("text");
    res.send(err.message);
}

app.use(errorHandler);

// Starts the app on an open port
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
