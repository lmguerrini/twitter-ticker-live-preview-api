(function twitterApiTickerLivePreview() {
    var liveTweets;
    var headlines = $("#headlines");
    var livePreview = $("#preview");
    var headlinesLeftPositionStart;
    var headlinesLeftPosition;
    var leftlivePreviewPosition = -($(window).width() / 3);
    var totalLinksWindowWidth = 0;
    var onOverlay = false;
    var onSection = true;
    var myFrame = false;
    var reqAnimId;
    var reqLivPrevAnimId;

    //  Ajax request to the Twitter API
    $.ajax({
        method: "GET",
        url: "data.json",
        beforeSend: function () {
            if (!$("#tweetsApiImage").hasClass("displayNone")) {
                $("#tweetsApiImage").addClass("displayNone");
            }
            if ($("#loadingImage").hasClass("visibilityHidden")) {
                $("#loadingImage").removeClass("visibilityHidden");
            }
        },
        complete: function () {
            if (!$("#loadingImage").hasClass("visibilityHidden")) {
                $("#loadingImage").addClass("fadeOut");
                setTimeout(function () {
                    $("#loadingImage").addClass("visibilityHidden");
                    $("#reloadPage").removeClass("displayNone");
                }, 2000);
            }
            if ($("#tweetsApiImage").hasClass("displayNone")) {
                setTimeout(function () {
                    $("#tweetsApiImage")
                        .removeClass("displayNone")
                        .addClass("fadeIn");
                }, 2000);
            }
        },
        success: function (data) {
            for (var i = 0; i < data.slice(0, 7).length; i++) {
                liveTweets +=
                    "<a href=" +
                    data[i].href +
                    ">" +
                    '<img src="images/twitter.gif" id="tweeters">' +
                    data[i].text +
                    "</a>";
            }
            if (liveTweets.startsWith("undefined")) {
                liveTweets = liveTweets.substring(9);
            }
            $("#headlines").html(liveTweets);
            headlinesLeftPositionStart = headlines.offset().left;
            headlinesLeftPosition = headlines.offset().left;
        },
        error: function (error) {
            console.log("error: ", error);
        },
    });

    // check total links width
    function setTotalLinksWindowWidth() {
        totalLinksWindowWidth = Number(Math.round($(window).width()) + 700);
        for (var w = 0; w < $("a").length; w++) {
            totalLinksWindowWidth += Number(Math.round($("a").eq(w).width()));
        }
    }

    function tickerAnimation() {
        if (typeof liveTweets != "undefined" && liveTweets.length > 0) {
            headlinesLeftPosition -= 2;
            totalLinksWindowWidth -= 2;
            headlines.css({
                left: headlinesLeftPosition + "px",
            });
            console.log(totalLinksWindowWidth);
            if (totalLinksWindowWidth < 0) {
                headlinesLeftPosition = headlinesLeftPositionStart;
                setTotalLinksWindowWidth();
            }
        }
        reqAnimId = requestAnimationFrame(tickerAnimation);
    }
    tickerAnimation();

    function livePreviewAnimation() {
        if (onOverlay || myFrame) {
            leftlivePreviewPosition += 2.5;
            livePreview.css({
                left: leftlivePreviewPosition + "px",
            });

            if (leftlivePreviewPosition > $(window).width() / 2.2) {
                leftlivePreviewPosition = -($(window).width() / 2.2);
            }
            reqLivPrevAnimId = requestAnimationFrame(livePreviewAnimation);
        }
    }
    livePreviewAnimation();

    // handling links over
    $("#headlines").on("mouseover", function (e) {
        $("#tweetsApiImage").addClass("fadeOut");
        onSection = false;
        onOverlay = true;
        cancelAnimationFrame(reqAnimId);
        e.preventDefault();
        $("#overlay").removeClass("fadeOut displayNone");
        $("#previewsContainer").removeClass("fadeOut displayNone");
        $("#loadingImage")
            .removeClass("fadeOut visibilityHidden")
            .addClass("fadeIn");
        setTimeout(function () {
            $("#tweetsApiImage").addClass("displayNone");
            $("#reloadPage").addClass("displayNone");
            $("#overlay").addClass("fadeIn");
            $("#previewsContainer").addClass("fadeIn");
            $("#myIframe").attr("src", e.target.href);
        }, 500);
        requestAnimationFrame(livePreviewAnimation);
    });

    // handling links leave
    $("#headlines").on("mouseleave", function (e) {
        setTimeout(function () {
            requestAnimationFrame(tickerAnimation);
            $(e.target).css({
                color: "gray",
                textDecorationLine: "none",
            });
            if (!myFrame) {
                onSection = true;
                $("#tweetsApiImage").removeClass("fadeOut");
                $("#overlay").removeClass("fadeIn").addClass("fadeOut");
                $("#previewsContainer")
                    .removeClass("fadeIn")
                    .addClass("fadeOut");
                $("#loadingImage").removeClass("fadeIn");
                setTimeout(function () {
                    if (!myFrame) {
                        $("#loadingImage").addClass("fadeOut");
                    }
                }, 500);
                setTimeout(function () {
                    onOverlay = false;
                    if (!myFrame) {
                        $("#previewsContainer").addClass("displayNone");
                        $("#overlay").addClass("displayNone");
                        $("#tweetsApiImage")
                            .removeClass("displayNone")
                            .addClass("fadeIn");
                        $("#reloadPage").removeClass("displayNone");
                        $("#loadingImage").addClass("visibilityHidden");
                        $("#myIframe").attr("src", "");
                    }
                }, 1500);
            }
        }, 500);
    });

    // check main section on over
    $("section").on("mouseenter", function (e) {
        onSection = true;
        setTimeout(function () {
            if (
                !myFrame &&
                !onOverlay &&
                onSection &&
                !$("#previewsContainer").hasClass("displayNone") &&
                !$("#overlay").hasClass("displayNone")
            ) {
                $("#previewsContainer").addClass("displayNone");
                $("#overlay").addClass("displayNone");
            }
        }, 500);
    });

    // handling link live preview over
    $("#myIframe").on("mouseenter", function (e) {
        onSection = false;
        myFrame = true;
        e.preventDefault();
        $("#overlay").removeClass("fadeOut displayNone");
        $("#overlay").addClass("fadeIn");
        // $("#myIframe").attr("src", $(this).attr("href"));
    });

    // handling link live preview leave
    $("#myIframe").on("mouseleave", function (e) {
        onOverlay = false;
        $("#previewsContainer").removeClass("fadeIn").addClass("fadeOut");
        $("#overlay").removeClass("fadeIn").addClass("fadeOut");
        $("#loadingImage").removeClass("fadeIn").addClass("fadeOut");
        $("#tweetsApiImage").removeClass("fadeOut");
        setTimeout(function () {
            $("#previewsContainer").addClass("displayNone");
            $("#overlay").addClass("displayNone");
            $("#tweetsApiImage").removeClass("displayNone").addClass("fadeIn");
            $("#reloadPage").removeClass("displayNone");
            $("#loadingImage").addClass("visibilityHidden");
            myFrame = false;
        }, 1500);
    });
})();
