
function loadData() {

    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ", " + cityStr;

    $('#greeting').text("You want to live at "+ address + ".");

    // load streetview
    var streetViewUrl = "http:/maps.googleapis.com/maps/api/streetview?size=600x400&location="+address;
    $('body').append('<img class="bgimg" src="' + streetViewUrl + '">');

    // NYT request
    var nytimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&sort=newest&api-key=6120440a2b4a498095821bb9077563ee";
    $.getJSON(nytimesUrl, function(data){
        $nytHeaderElem.text("New York Times Articles About " + cityStr);
        articles = data.response.docs;
        for( var i=0; i<articles.length; i++){
            article = articles[i]
            $nytElem.append("<li class='article'>" +
                "<a href='" + article.web_url + "'>" + article.headline.main + "</a>" + "<p>" + article.snippet + "</p>" + "</li>");
        };
    }).error(function(){
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    // Wikipedia request
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallback";

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia pages")
    }, 8000);

    $.ajax(wikiUrl, {
        //url: wikiUrl,
        dataType: "jsonp",
        //jsonp: "callback",
        success: function( response ){
            var articleList = response[1];
            for (var i=0; i< articleList.length; i++){
                articleStr = articleList[i];

                var url = "http://en.wikipedia.org/wiki/" + articleStr;
                $wikiElem.append("<li><a href='>" + url + "'>" + articleStr + "</a></li>");
            };
            clearTimeout(wikiRequestTimeout);
        }
    })

    return false;
};

$('#form-container').submit(loadData);
