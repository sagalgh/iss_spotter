//contain most of the logic for fetching the data from each API endpoint.


/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)

 */
const request = require('request');
const fetchMyIP = function(callback) {
  const url = 'https://api.ipify.org?format=json';
  // use request to fetch IP address from JSON API
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    const ip = data["ip"];

    callback(error, ip);
  });
};


// It should take in two arguments: ip (string) and callback
// Add the function to the object properties being exported from iss.js
// For now, it can have an empty body and do nothing


const fetchCoordsByIP = (ip, callback) => {
  const url = `https://api.freegeoip.app/json/${ip}?apikey=XXXXXXX`;
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    const lat = data["latitude"];
    const long = data["longitude"];
    callback(error, { lat, long });

  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.lat}&lon=${coords.long}`;
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS Fly Over Times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    const risetimes = data["response"];
    //console.log(risetimes)
    callback(null, risetimes);


  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
    }
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        console.log(`It didn't work!`, error);
      }

      fetchISSFlyOverTimes(data, (error, risetimes) => {
        if (error) {
          console.log(`It didn't work!`, error);
        }
        callback(null, risetimes);
      }
      );
    });


  });
};





module.exports = { nextISSTimesForMyLocation };
//pass through the error to the callback if an error occurs when requesting the IP data
// parse and extract the IP address using JSON and then pass that through to the callback (as the second argument) if there is no error
//module.exports = { fetchMyIP,fetchCoordsByIP,fetchISSFlyOverTimes};