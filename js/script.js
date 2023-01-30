const searchInput = $("#search-input");
const searchButton = $("#search-button");
const historyList = $("#history");
const apiKey = "6024d10a1c0b002970684a9ec11ff307"
const currentTime = moment().format('(DD/M/YYYY)');
const appendIcon = $("<img>");
const historyButton = $(".historyButton");
const clearHistory = $("#clearHistory");


// Function to append button to history list.
const appendButton = item => {
    const createButton = $("<button>");
    createButton.text(item);
    historyList.prepend(createButton.addClass("btn-outline-dark btn-sm historyButton").attr("data-name", item));
};

// Function to shows weather when clicked on history button.
historyList.on("click", ".historyButton", item => {
    const targeted = $(item.target);
    const attribute = targeted.attr('data-name')
    checker(attribute);
});

// Variable to save all searched history inputs from localStorage.
let history = JSON.parse(localStorage.getItem("Search-History")) || [];
// Append button for every history item.
history.forEach(appendButton)

const checker = item => {
    const request = openWeatherGeo(item);
    // if input value have not found in openWeather it alerts a user.
    if (request.length === 0) {
        alert("Check your input! City not found")
        searchInput.val("")
        return;
    } else {
        // Empty Today forecast and 5 day forecast divs.
        $("#today").empty();
        $("#forecast").empty();
        // Checks if the value already existing.
        if (!history.includes(item) || "") {
            history.push(searchInput.val().toUpperCase());
            //  Pushes history array to localStorage.
            localStorage.setItem('Search-History', JSON.stringify(history));
            appendButton(searchInput.val().toUpperCase());
        };
        // Sets search input to empty string.
        searchInput.val("")
    };
};

// onClick function to send input to append button function.
searchButton.on("click", event => {
    event.preventDefault();
    checker(searchInput.val().toUpperCase())
    checksHistoryItems()
});

// Function to get lon nad lat.
const openWeatherGeo = item => {
    const quaryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + item + "&appid=" + apiKey;
    var array = [];
    $.ajax({
        url: quaryUrl,
        method: "GET",
        async: false
    }).done(response => {
        // Pushes lon and lat to array
        array.push(response.coord.lon);
        array.push(response.coord.lat);
    });
    // takes lon and lat and sends it to openWeather function.
    openWeather(array[0], array[1]);
    // returns array to check is it input found in openweather data.
    return array;
};

// Function to get an object from openweather from retrieved lon and lat.
const openWeather = (lon, lat) => {
    const quaryUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    $.ajax({
        url: quaryUrl,
        metgod: "get"
    }).then(response => {
        showUp(response);
    });
};

// Function witch put in to HTML recieved data from openWeather.
const showUp = response => {
    // Variable for todays icon URL
    $("#today").attr("style", "margin: 0; padding: 10px; border: 1px solid black;")
    let todaysIcon = "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png";
    $("#today").append($("<h1>").text(response.city.name + " " + currentTime).append(appendIcon.attr("src", todaysIcon)));
    // Todays Temperature in Celcius.
    const tempToC = Math.floor(response.list[0].main.temp - 273.15);
    $("#today").append($("<p>").text("Temp: " + tempToC + " ℃"));
    // Todays wind
    $("#today").append($("<p>").text("Wind: " + response.list[0].wind.speed + " KPH"));
    // Todays Humidity
    $("#today").append($("<p>").text("Humidity: " + response.list[0].main.humidity + "%"));
    // TEXT
    $("#forecast").append($("<h2>").text("Five days forecast :").attr("style", "width: 100%"));
    // 5 day forecast
    const loopItems = [response.list[8], response.list[16], response.list[24], response.list[32], response.list[39]];
    // Loop throw 5 day forecast and put in the divs.
    for (let i = 0; i < loopItems.length; i++) {
        const tempToC = Math.floor(loopItems[i].main.temp - 273.15);
        let icon = "http://openweathermap.org/img/wn/" + loopItems[i].weather[0].icon + "@2x.png";
        // Variable to save a day + 1
        const day = moment().add(i + 1, 'days').format('(DD/M/YYYY)');
        // Variable creates div
        const addDiv = $("<div>")
        // Added elements to divs.
        addDiv.append($("<h5>").text(day));
        addDiv.append($("<img>").attr("src", icon));
        addDiv.append($("<p>").text("Temp: " + tempToC + " ℃"));
        addDiv.append($("<p>").text("Wind: " + loopItems[i].wind.speed.toFixed() + " KPH"));
        addDiv.append($("<p>").text("Humidity: " + loopItems[i].main.humidity + "%"));
        $("#forecast").append(addDiv.addClass("w-20 col-lg-2 col-sm"));
    };
};

// Checks if there is history button if there is shows last one.
if ($(".historyButton").length > 0) {
    openWeatherGeo($("#history button:first").text());
}

// Clears a history on click.
clearHistory.on("click", function () {
    localStorage.clear();
    location.reload();
})

// Function if history list more then 5 elements clear history button shows up.
function checksHistoryItems() {
    if (history.length >= 5) {
        clearHistory.attr("style", "display: block")
    }
};

checksHistoryItems()