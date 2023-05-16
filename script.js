const express = require('express');
const request = require("request");
const cors = require('cors');

const app = express();

app.use(cors());

const API_KEY = "91256a0530b9b02ca05a2233a7608072"; 

app.get('/weather/:lat/:lon', (req, res) => {
  // res.send('Hello World!');
  console.log("welcome to the root!");
  
  var lat = req.params.lat;
  var lon = req.params.lon;
  console.log(lat, lon);
  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`

  
	request(url, (error, response, body)=>{
		
		// Printing the error if occurred
		if(error) console.log(error)
	   
		// Printing status code
		console.log(response.statusCode);
		 
		// Printing body
		body = JSON.parse(body)
        let weatherStatus = body.weather[0].main // Gives us the weather status
        res.send({"temperature" : body.main.temp , "weatherStatus" : weatherStatus});
		console.log(body.main.temp);
        
	});
  
});

app.get('/5day/:lat/:lon', (req, res) => {
    //res.send('Hello World!');
    console.log("welcome to the root!");
    
    var lat = req.params.lat;
    var lon = req.params.lon;
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  
    
      request(url, (error, response, body)=>{
          
          // Printing the error if occurred
          if(error) console.log(error)
         
          // Printing status code
          console.log(response.statusCode);
           
          // Printing body
          body = JSON.parse(body)
          const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          let forecast = [];
          
          let todaysDate = new Date().getDay(); // Returns a number 0-6
          for (let i = 0; i < 5; i++){ // 0 1 2 3 4
            let tempSum = 0; // sum of all temps for a day
            let count = 0; // number of datapoints for a day
            for (const dataPoint of body.list){ // iterates through each datapoint
                let date = new Date(dataPoint.dt * 1000) // Convert seconds to ms, then convert to JS Date
                if (date.getDay() === todaysDate){ // If the day of week (0-6) matches today's date
                    count++; // Adds 1 to our total data points for the day
                    tempSum += dataPoint.main.temp; // Adds to the running total of temps for the day
                }
            }
            let day = {"dayName" : week[todaysDate] , "temp" : Math.round(tempSum/count)}
            forecast.push(day); // Adds the JSON datapoint to our forecast
            todaysDate = (todaysDate + 1) % 7;
          }
          res.send(forecast);
      });
    
  });

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
