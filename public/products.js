/**
 * Name: Emily Zhang
 * Date: June 9th, 2023
 *
 * Javascript functions to handle the products view for my e-commerce store.
 */

(function() {
    "use strict";
    const NUM_DECIMALS = 2;

    /**
     * Initializes the product page view.
     */
    function init() {
        window.addEventListener("load", loadProducts);
        const animals = id("animals");
        animals.addEventListener("click", filterProducts);
        const buildings = id("buildings");
        buildings.addEventListener("click", filterProducts);
        const characters = id("characters");
        characters.addEventListener("click", filterProducts);
        const misc = id("misc");
        misc.addEventListener("click", filterProducts);
    }

    /**
     * Displays a product view with additional information when a product
     * is clicked and hides all other products.
     */
    function viewProduct() {
        clearProducts();
        let name = this.parentElement.querySelector("h3").textContent;
        const url = `/product?name=${name}`;
        fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .then(function(data) {
                processProductInfo([data]);
                const desc = qs(".description");
                desc.classList.remove("hidden");
                qs(".item").classList.add("product-view");
                qs("img").removeEventListener("click", viewProduct);
            })
            .catch(handleError);
    }

    /**
     * Filter products belonging to corresponding category when filter is
     * clicked.
     */
    function filterProducts() {
        clearProducts();
        const url = `/category?category=${this.textContent.toLowerCase()}`;
        fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .then(processProductInfo)
            .catch(handleError);
    }

    /**
     * Clears all products from the page.
     */
    function clearProducts() {
        const container = id("products");
        while (container.firstChild) {
            container.removeChild(container.lastChild);
        }
    }

    /**
     * Adds specified item to the user's cart.
     */
    function addItemToCart() {
        let name = this.parentElement.querySelector("h3").textContent;
        let params = new FormData();
        params.append("name", name);
        const url = "/addProduct";
        fetch(url, { method : "POST", body : params })
            .then(checkStatus)
            .then(response => response.text())
            .catch(handleError);
    }

    /**
     * Loads all product information when products window is viewed.
     */
    function loadProducts() {
        const url = "/products";
        fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .then(function(data) {
                processProductInfo(data["products"]);
            })
            .catch(handleError);
    }

    /**
     * Processes the JSON data and formats the product information to be
     * displayed on the products page.
     * @param {JSON Object} data - JSON data holding the product information
     * including name, price, description, etc.
     */
    function processProductInfo(data) {
        const container = id("products");
        for (let i = 0; i < data.length; i++) {
            const productInfo = data[i];
            let item = gen("div");
            item.classList.add("item");

            let img = gen("img");
            img.src = productInfo["image"];
            img.alt = productInfo["name"] + " nanoblock";
            img.addEventListener("click", viewProduct);
            item.appendChild(img);

            let category = gen("p");
            category.textContent = productInfo["category"];
            category.classList.add("hidden");
            category.classList.add("category");
            item.appendChild(category);

            let itemDetails = gen("div");
            let itemName = gen("h3");
            itemName.textContent = productInfo["name"];

            let itemPrice = gen("p");
            itemPrice.textContent = "$" + productInfo["price"].toFixed(NUM_DECIMALS);

            let bagButton = gen("button");
            bagButton.classList.add("bag-button");

            let bagIcon = gen("img");
            bagIcon.src = "imgs/bag.png";
            bagIcon.alt = "Add to Bag icon";
            bagButton.appendChild(bagIcon);
            bagButton.appendChild(document.createTextNode("Add to Bag"));
            bagButton.addEventListener("click", addItemToCart);

            let itemDesc = gen("p");
            itemDesc.textContent = productInfo["description"];
            itemDesc.classList.add("description");
            itemDesc.classList.add("hidden");
            itemDetails.appendChild(itemName);
            itemDetails.appendChild(itemPrice);
            itemDetails.appendChild(bagButton);
            itemDetails.appendChild(itemDesc);
            item.appendChild(itemDetails);
            container.appendChild(item);
        }
    }

    /**
     * Displays a user-friendly error message on the products page.
     * @param {Error} err - the error details of the request.
     */
    function handleError(err) {
        const container = id("products");
        let msg = gen("p");
        msg.textContent = "There was an error loading the products page. " +
                          "Please try again later.";
        container.appendChild(msg);
    }

    init();
})();