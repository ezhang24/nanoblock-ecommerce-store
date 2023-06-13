/**
 * Name: Emily Zhang
 * Date: June 2nd, 2023
 *
 * Javascript functions to handle the FAQ view for my e-commerce store.
 */

(function() {
    "use strict";

    /**
     * Initializes the FAQ page.
     */
    function init() {
        window.addEventListener("load", loadFAQ);
    }

    /**
     * Loads all FAQ information when FAQ window is viewed.
     */
    function loadFAQ() {
        const url = "/faq";
        fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .then(processFAQ)
            .catch(handleError);
    }

    /**
     * Processes the JSON data and formats the FAQ information to be
     * displayed on the FAQ page.
     * @param {JSON Object} data - JSON data holding the FAQ information
     * including question and answer.
     */
    function processFAQ(data) {
        const container = id("faq");
        for (let i = 0; i < data["faq"].length; i++) {
            const questionData = data["faq"][i]["question"];
            let question = gen("p");
            let bold = gen("strong");
            bold.textContent = questionData;
            question.appendChild(bold);
            container.appendChild(question);

            const answerData = data["faq"][i]["answer"];
            let answer = gen("p");
            answer.textContent = answerData;
            container.appendChild(answer);
        }
    }

    /**
     * Displays a user-friendly error message on the FAQ page.
     * @param {Error} err - the error details of the request.
     */
    function handleError(err) {
        const container = id("faq");
        let msg = gen("p");
        msg.textContent = "There was an error loading the FAQ page. " +
                          "Please try again later.";
        container.appendChild(msg);
    }

    init();
})();