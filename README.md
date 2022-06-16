<div align="center" style="background:black;">
  <img alt="logo" src="ticker/git/twitter-live-preview.png">
</div>

# Twitter Ticker Live Preview API

Live Preview Twitter Ticker made during my Full-Stack Web Developer Bootcamp at [Spiced Academy](https://www.spiced-academy.com/en/program/full-stack-web-development/berlin) in Berlin. <br /><br />
Through a request from several pre-selected news sources from the Twitter's API (like: "_GoogleAI_", "_DeepMind_", "\_DeepLearningAI\__", "\_OpenAI_", "_StanfordAILab_", "_AndNlp_", "_ArtIntelligenc_", "_berkeley_ai_", "_mit_insights_", "_medialab_"), the combined list of received tweets will appear through a ticker animation. By hovering one of these tweets it is possible to have a live preview in a pop-up window without having to leave the page. Clicking any tweet will instead redirect the user to the related tweet's website, thus allowing to directly read the entire web page in full screen.

## Technologies

-   Front-End: [jQuery](https://jquery.com), [AJAX](https://api.jquery.com/jquery.ajax/)
-   Back-End: [Node.js](https://nodejs.org/en/about/) / [Express](http://expressjs.com)

## Main features

-   Getting tweets from pre-selected Twitter news sources by making an AJAX call and HTTPS requests as required from the Twitter's API
-   Loading animation while waiting for API response
-   Tweets rendering through a ticker animation at the top of the screen
-   Pop-up scrollable live preview window when hovering one of the tweet
-   Clicking any tweet will redirect the user to the related tweet's website, thus allowing to directly read the entire web page in full screen

## Preview

![](ticker/git/ticker-live-preview.gif)
