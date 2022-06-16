const https = require("https");
const { twitterKey, twitterSecret } = require("./secrets");

module.exports.getToken = () => {
    return new Promise((resolve, reject) => {
        //  In Node we can base64 encode a string by first converting it to a Buffer,
        //  which is a representation of the string's data in binary and then into a base64 encoded string.
        const creds = `${twitterKey}:${twitterSecret}`;
        const encodedCreds = Buffer.from(creds).toString("base64");

        const configToken = {
            method: "POST",
            host: "api.twitter.com",
            path: "/oauth2/token",
            headers: {
                Authorization: `Basic ${encodedCreds}`,
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
        };

        function httpsRequestCallbackToken(responseFromTwitter) {
            if (responseFromTwitter.statusCode !== 200) {
                reject(new Error(responseFromTwitter.statusCode));
                return;
            }
            let body = "";
            responseFromTwitter.on("data", (chunk) => (body += chunk));
            responseFromTwitter.on("end", () => {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody.access_token);
            });
        }

        const reqToken = https.request(configToken, httpsRequestCallbackToken);
        reqToken.end("grant_type=client_credentials");
    });
};

module.exports.getTweets = (bearerToken, dynamicScreenName) => {
    return new Promise((resolve, reject) => {
        const configTweets = {
            method: "GET",
            host: "api.twitter.com",
            path: `/1.1/statuses/user_timeline.json?screen_name=${dynamicScreenName}&tweet_mode=extended`,
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        };

        function httpsRequestCallbackTweets(res) {
            if (res.statusCode !== 200) {
                reject(new Error(res.statusCode));
                return;
            }
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
            });
        }

        const reqTweets = https.request(configTweets, httpsRequestCallbackTweets);
        reqTweets.end("grant_type=client_credentials");
    });
};

module.exports.filterTweets = (tweets) => {
    let dataJson = [];
    let twitterText;

    for (let i = 0; i < tweets.length; i++) {
        if (tweets[i].entities.urls.length === 1) {
            // remove (if) "read more" and tabs inside string
            if (
                !tweets[i].full_text.includes("Read more") &&
                !tweets[i].full_text.includes("&amp;") &&
                !/\r|\n/.exec(tweets[i].full_text)
            ) {
                twitterText = tweets[i].full_text.replace(/\s+/g, " ");
            }
            if (typeof twitterText !== "undefined") {
                let twitterTextArr = twitterText.split(" ");
                twitterTextArr.pop();
                let newTwitterText = twitterTextArr.join(" ");
                // remove "https://" (if) end string
                if (newTwitterText.includes("https://")) {
                    let indexHttps = newTwitterText.indexOf("https://");
                    newTwitterText = newTwitterText.substring(0, indexHttps - 1);
                }
                // remove from "|" (if) inside string
                if (newTwitterText.includes("|")) {
                    let indexI = newTwitterText.indexOf("|");
                    newTwitterText = newTwitterText.substring(0, indexI - 1);
                }
                // remove space (if) end string
                if (newTwitterText.slice(-1) == " ") {
                    newTwitterText = newTwitterText.slice(0, newTwitterText.length - 1);
                }

                // remove punctuation [.,:;] (if) end string
                if (newTwitterText.substr(newTwitterText.length - 1).match(/^[.,:;]/)) {
                    newTwitterText = newTwitterText.slice(0, newTwitterText.length - 1);
                }
                // remove (if) string starts w/ number, "["
                // or contains "@", "...", "watch", too many uppercase letters
                if (
                    newTwitterText.match(/^\d/) ||
                    newTwitterText.startsWith("[") ||
                    newTwitterText.includes("@") ||
                    newTwitterText.includes("...") ||
                    newTwitterText.toLowerCase().includes("watch") ||
                    newTwitterText.replace(/[^A-Z]/g, "").length > 15
                ) {
                    newTwitterText = "";
                }

                let twitterHref = tweets[i].entities.urls[0].url;

                if (newTwitterText !== "" && twitterHref !== "") {
                    dataJson.push({
                        text: newTwitterText,
                        href: twitterHref
                    });
                }
            }
        }
    }

    // remove duplicate tweets
    let removeDuplicate = dataJson.filter(
        (value, index, self) => index === self.findIndex((t) => t.text === value.text)
    );
    // remove empty tweets
    let removeEmpty = removeDuplicate.filter((obj) => !(obj && Object.keys(obj).length === 0));
    // remove long tweets
    let filteredTweets = removeEmpty.filter((obj) => String(obj.text).length < 80);

    return filteredTweets;
};
