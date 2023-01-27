const searchInput = $("#search-input");
const searchButton = $("#search-button");
const historyList = $("#history");
const apiKey = "6024d10a1c0b002970684a9ec11ff307"
const currentTime = moment().format('(DD/M/YYYY)');
const appendIcon = $("<img>");




// Function to append button to history list.
const appendButton = item => {
    const createButton = $("<button>");
    createButton.text(item);
    historyList.prepend(createButton.addClass("btn-outline-dark btn-sm"));
};



// onClick function to send input to append button function.
searchButton.on("click", event => {
    event.preventDefault();
    $("#today").empty();
    $("#forecast").empty();
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
        array.push(response.coord.lon);
        array.push(response.coord.lat);
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
        showUp(response);
    });
};

const showUp = response => {
    // Variable for todays icon URL
    let todaysIcon = "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png";
    $("#today").append($("<h1>").text(response.city.name +" "+ currentTime).append(appendIcon.attr("src", todaysIcon)));
    // Todays Temperature in Celcius.
    const tempToC = Math.floor(response.list[0].main.temp -  273.15);
    $("#today").append($("<p>").text("Temp: " + tempToC + " ℃"));
    // Todays wind
    $("#today").append($("<p>").text("Wind: " + response.list[0].wind.speed + " KPH"));
    // Todays Humidity
    $("#today").append($("<p>").text("Humidity: " + response.list[0].main.humidity + "%"));



    // 5 day forecast
    const loopItems = [response.list[8], response.list[16], response.list[24], response.list[32], response.list[39]];
  
    for (let i = 0; i < loopItems.length; i++) {
        const tempToC = Math.floor(loopItems[i].main.temp -  273.15);
        let icon = "http://openweathermap.org/img/wn/" + loopItems[i].weather[0].icon + "@2x.png";
        // Variable to save a day + 1
        const day = moment().add(i + 1, 'days').format('(DD/M/YYYY)');
        // Variable creates div
        const addDiv = $("<div>")
        // Add elements to div.
        addDiv.append($("<h5>").text(day));
        addDiv.append($("<img>").attr("src", icon));
        addDiv.append($("<p>").text("Temp: " + tempToC + " ℃"));
        addDiv.append($("<p>").text("Wind: " + loopItems[i].wind.speed + " KPH"));
        addDiv.append($("<p>").text("Humidity: " + loopItems[i].main.humidity + "%"));
        $("#forecast").append(addDiv.addClass("w-20 col-lg-2 col-sm"));
        
    };
};

