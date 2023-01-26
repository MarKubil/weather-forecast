const searchInput = $("#search-input");
const searchButton = $("#search-button");
const historyList = $("#history");
const apiKey = "6024d10a1c0b002970684a9ec11ff307"

const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');

// Function to append button to history list.
const appendButton = item => {
    const createButton = $("<button>");
    createButton.text(item);
    historyList.prepend(createButton.addClass("btn-outline-dark btn-sm"));
};



// onClick function to send input to append button function.
searchButton.on("click", event => {
    event.preventDefault();
    const request = openWeather(searchInput.val());

    // if input value have not found in openWeather it alerts a user.
    if (request.length === 0) {
        alert("Check your input! City not found")
        searchInput.val("")
        return;
    } else {
        appendButton(searchInput.val());
        searchInput.val("")
    }
});


// Function to get 
const openWeather = item => {

    const quaryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + item + "&appid=" + apiKey;
    var array = [];
    $.ajax({
        url: quaryUrl,
        method: "GET",
        async: false
    }).done(response => {
        // Pushes lon and lat to array and then returns it.
        array.push(response.coord.lon);
        array.push(response.coord.lat);
    });

    return array;
};