const request = require('request-promise-native');


const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body){
  const ip = JSON.parse(body).ip;

  return request(`https://api.freegeoip.app/json/${ip}?apikey=b8a7eec0-3ddd-11ec-9b5a-417b476209d2`)
}

const fetchISSFlyOverTimes = function(coords) {
  const latitude = JSON.parse(coords).latitude
  const longitude = JSON.parse(coords).longitude
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
  
};


const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};



module.exports = {nextISSTimesForMyLocation}