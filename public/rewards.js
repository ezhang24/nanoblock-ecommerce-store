/**
 * Name: Emily Zhang
 * Date: June 8th, 2023
 *
 * Javascript functions to handle the rewards page for my e-commerce store.
 */

(function() {
    "use strict";

    /**
     * Initializes the rewards page submission form.
     */
    function init() {
        const submitBtn = id("rewards-submit-btn");
        submitBtn.addEventListener("click", function(evt) {
            evt.preventDefault();
            submitForm();
        });
    }

    /**
     * Sends a POST request to write the member information
     * into a file for records. Sends an error message to the user otherwise.
     */
    function submitForm() {
        const url = "/rewards";
        const params = new FormData(id("rewards-form"));
        let name = id("rewards-name").value;
        let email = id("rewards-email").value;
        let number = id("rewards-number").value;
        if (!(name && email && number)) {
            handleError("Missing name, email, and/or number on member form. Please try again.");
        } else {
            fetch(url, { method : "POST", body : params })
                .then(checkStatus)
                .then(response => response.text())
                .then(sendMsg)
                .catch(function(err) {
                    handleError("There was an error in submitting the form. " +
                                "Please try again later.");
                });
        }
    }

    /**
     * Displays a success message once user submits the membership form.
     * @param {String} data - String holding the success message.
     */
    function sendMsg(data) {
        const container = id("rewards-container");
        let msg = gen("p");
        msg.textContent = data;
        if (container.lastChild instanceof HTMLParagraphElement) {
            container.removeChild(container.lastChild);
        }
        container.appendChild(msg);
    }

    /**
     * Displays a user-friendly error message on the contact page.
     * @param {String} err - the error details of the request.
     */
    function handleError(err) {
        const container = id("rewards-container");
        let msg = gen("p");
        msg.textContent = err;
        if (container.lastChild instanceof HTMLParagraphElement) {
            container.removeChild(container.lastChild);
        }
        container.appendChild(msg);
    }

    init();
})();