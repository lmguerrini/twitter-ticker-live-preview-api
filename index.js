const express = require("express");
const app = express();
const { getToken, getTweets, filterTweets } = require("./twitter");

app.use(express.static("./ticker"));

app.get("/data.json", (req, res) => {
    getToken().then((bearerToken) => {
        return Promise.all([
            getTweets(bearerToken, "mit_insights"),
            getTweets(bearerToken, "medialab"),
            getTweets(bearerToken, "techreview"),
            getTweets(bearerToken, "GoogleAI"),
            getTweets(bearerToken, "DeepMind"),
            getTweets(bearerToken, "DeepLearningAI_"),
            getTweets(bearerToken, "OpenAI"),
            getTweets(bearerToken, "StanfordAILab"),
            getTweets(bearerToken, "berkeley_ai"),
            getTweets(bearerToken, "AndNlp"),
            getTweets(bearerToken, "ArtIntelligenc"),
        ])
            .then((tweets) => {
                let mergedTweets = tweets[0].concat(
                    tweets[1],
                    tweets[2],
                    tweets[3],
                    tweets[4],
                    tweets[5],
                    tweets[6],
                    tweets[7],
                    tweets[8],
                    tweets[9],
                    tweets[10]
                );
                let sortedTweets = mergedTweets.sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                if (filterTweets) {
                    const filteredTweets = filterTweets(sortedTweets);
                    res.json(filteredTweets);
                }
            })
            .catch((err) => {
                console.error("err in catch: ", err);
                res.sendStatus(500);
            });
    });
});

app.listen(8080, () => console.log("Server Twitter API listening on 8080"));
