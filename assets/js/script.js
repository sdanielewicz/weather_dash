var APIkey = "cc4f25f38ce192170b2f399cde7b66fe";
var city = "";
var search_btn = $("#search_btn");
var city_btn1 = $("#city_btn1");
var city_btn2 = $("#city_btn2");
var city_btn3 = $("#city_btn3");
var city_btn4 = $("#city_btn4");

// get weather data for right now and write it to the page 
function writeNow() {

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIkey;


  fetch(queryURL, {
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var tempNow = data.main.feels_like;
      var windNow = data.wind.speed;
      var humidNow = data.main.humidity;
      // date was in unix time and needed to be converted 
      var dateNow = new Date(data.dt * 1000).toLocaleDateString();

      var getIcon = data.weather[0].icon;
      var iconNow = new Image(getIcon);
      iconNow.src = "https://openweathermap.org/img/wn/" + getIcon + "@2x.png";
      iconNow.width = 100;

      // seperate api call needed for uv data 
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=45b6598a4a1bd706ba39bf0f2ac2fcf4"

      fetch(uvURL, {
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var uvNow=data.value;

      $('#cityNow').text(city);
      $('#cityNow').append(iconNow);
      $('#dateNow').text(dateNow);
      $('#tempNow').text("Temp: " + tempNow + " °F");
      $('#windNow').text("Wind: " + windNow + " MPH");
      $('#humidNow').text("Humidity:" + humidNow + "%");
      $('#uvNow').text("UV: " + uvNow);
    });
    });
}

// get 5 day forecast data and write it to the page 
function writeForecast() {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIkey;
  var cityID;

  fetch(queryURL, {
  })
    .then(function (response) {


      return response.json();
    })
    .then(function (data) {
      cityID = data.id;

      var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial&appid=" + APIkey;

      fetch(queryForecastURL, {
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {

          // iterate through api response but skip every 8 in order to get the next day
          // 39 since 40 is the max value returned 
          for (var i = 0; i < 39; i += 8) {
            var dateFor = new Date(data.list[i].dt * 1000).toLocaleDateString();
            var tempFor = data.list[i].main.feels_like;
            var windFor = data.list[i].wind.speed;
            var humidFor = data.list[i].main.humidity;

            var getForIcon = data.list[i].weather[0].icon;
            var iconForNow = new Image(getForIcon);
            iconForNow.src = "https://openweathermap.org/img/wn/" + getForIcon + "@2x.png";
            iconForNow.width = 100;

            // write to page using id name concatonated with current num value of i 
            $('#dateFor' + i).text(dateFor);
            $('#dateFor' + i).append(iconForNow);
            $('#tempFor' + i).text("Temp: " + tempFor + " °F");
            $('#windFor' + i).text("Wind: " + windFor + " MPH");
            $('#humidFor' + i).text("Humidity: " + humidFor + "%");
          }
        });
    });

}

// event listener and local storage section 
var count = 1;

// save to local storage and execute main funtions 
search_btn.on("click", function () {

  var saveit = $('#search_term').val();
  console.log("HERE" + count);

  localStorage.setItem(count, saveit);
  city = saveit;

  writeNow();
  writeForecast();

  count += 1;
});

// write history to page from local storage 
var write1 = localStorage.getItem('1');
$('#city1').text(write1);

var write2 = localStorage.getItem('2');
$('#city2').text(write2);

var write3 = localStorage.getItem('3');
$('#city3').text(write3);

var write4 = localStorage.getItem('4');
$('#city4').text(write4);

// change value of city to be passed to main write functions  
city_btn1.on("click", function () {
  city = write1;
  writeNow();
  writeForecast();
});

city_btn2.on("click", function () {
  city = write2;
  writeNow();
  writeForecast();
});

city_btn3.on("click", function () {
  city = write3;
  writeNow();
  writeForecast();
});

city_btn4.on("click", function () {
  city = write4;
  writeNow();
  writeForecast();
});