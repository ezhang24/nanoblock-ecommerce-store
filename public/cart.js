/**
 * Name: Emily Zhang
 * Date: June 8th, 2023
 *
 * Javascript functions to handle the cart view for my e-commerce store.
 */

(function() {
    "use strict";
    const NUM_DECIMALS = 2;

    /**
     * Initializes the cart page view.
     */
    function init() {
        window.addEventListener("load", loadCart);
        window.addEventListener("load", calculateTotal);
    }

    /**
     * Removes specified item from the user's cart.
     */
    function removeItemFromCart() {
        const url = "/removeProduct";
        let name = this.parentElement.querySelector("p").textContent;
        let params = new FormData();
        params.append("name", name);
        fetch(url, { method : "POST", body : params })
            .then(checkStatus)
            .then(response => response.text())
            .then(function(data) {
                window.location.reload();
            })
            .catch(handleError);
    }

    /**
     * Loads all cart information when cart window is viewed.
     */
    function loadCart() {
        const url = "/cart";
        fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .then(processCartInfo)
            .catch(handleError);
    }

    /**
     * Calculates and displays the total price from the cart.
     */
    function calculateTotal() {
        const url = "/cart";
        fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .then(function(data) {
                let sum = 0;
                for (let i = 0; i < data["cart"].length; i++) {
                    sum = sum + data["cart"][i]["price"] * data["cart"][i]["quantity"];
                }
                const total = id("total-price");
                total.innerHTML = "$" + sum.toFixed(NUM_DECIMALS);
            })
            .catch(handleError);
    }

    /**
     * Processes the JSON data and formats the cart information to be
     * displayed on the user's cart page.
     * @param {JSON Object} data - JSON data holding the product information
     * including name, price, description, etc.
     */
    function processCartInfo(data) {
        const container = id("my-cart");
        for (let i = 0; i < data["cart"].length; i++) {
            const item = data["cart"][i];
            let cartItem = gen("div");

            let cartDetails = gen("div");
            let img = gen("img");
            img.src = item["image"];
            img.alt = item["name"] + " nanoblock";

            let itemDetails = gen("div");
            let name = gen("p");
            let bold = gen("strong");
            bold.textContent = item["name"];
            name.appendChild(bold);
            let price = gen("p");
            price.textContent = "$" + item["price"].toFixed(NUM_DECIMALS);
            let qty = gen("p");
            qty.textContent = "Qty: " + item["quantity"];
            itemDetails.appendChild(name);
            itemDetails.appendChild(price);
            itemDetails.appendChild(qty);

            cartDetails.appendChild(img);
            cartDetails.appendChild(itemDetails);
            cartDetails.classList.add("cart-details");

            let bin = gen("img");
            bin.src = "imgs/bin.png";
            bin.alt = "Remove item icon";
            bin.addEventListener("click", removeItemFromCart);

            cartItem.appendChild(cartDetails);
            cartItem.appendChild(bin);
            cartItem.classList.add("cart-item");
            container.appendChild(cartItem);
        }
    }

    /**
     * Displays a user-friendly error message on the products page.
     * @param {Error} err - the error details of the request.
     */
    function handleError(err) {
        const container = id("my-cart");
        let msg = gen("p");
        msg.textContent = "There was an error loading the cart page. " +
                          "Please try again later.";
        container.appendChild(msg);
    }

    init();
})();