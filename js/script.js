const searchInput = $("#search-input");
const searchButton = $("#search-button");
const historyList = $("#history");
const apiKey = "6024d10a1c0b002970684a9ec11ff307"
const currentTime = moment().format('(DD/M/YYYY)');
let icon = "";
// Function to append button to history list.
const appendButton = item => {
    const createButton = $("<button>");
    createButton.text(item);
    historyList.prepend(createButton.addClass("btn-outline-dark btn-sm"));
};



// onClick function to send input to append button function.
searchButton.on("click", event => {
    event.preventDefault();
    const request = openWeatherGeo(searchInput.val());

    // if input value have not found in openWeather it alerts a user.
    if (request.length === 0) {
        alert("Check your input! City not found")
        searchInput.val("")
        return;
    } else {
        appendButton(searchInput.val());
        searchInput.val("")
    };

});

// Function to get 
const openWeatherGeo = item => {

    const quaryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + item + "&appid=" + apiKey;
    var array = [];
    $.ajax({
        url: quaryUrl,
        method: "GET",
        async: false
    }).done(response => {
        // Pushes lon and lat to array
        console.log(response)
        array.push(response.coord.lon);
        array.push(response.coord.lat);
        icon = response.weather[0].icon;
    });
    // takes lon and lat and sends it to openWeather function.
    openWeather(array[0], array[1]);
    // returns array to check is it input found in openweather data.
    return array;
};

const openWeather = (lon, lat) => {
    const quaryUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lon +"&appid=" + apiKey;
    $.ajax({
        url: quaryUrl,
        metgod: "get"
    }).then(response => {
        console.log(response);
        $("#today").append($("<h1>").text(response.city.name +" "+ currentTime))
    });
};


