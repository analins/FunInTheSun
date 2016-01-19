require('dotenv').load();
var request = require('request');


var zip = user.cities.main.zipcode;
var url = 'https://www.zipcodeapi.com/rest/' + process.env.ZIPAPIKEY +'/radius.radius.json/'+ zip +'/150/mile'

//////////////////////////////////////////////////
//** GET 10 RANDOM LOCATIONS FROM ZIPCODE API **//
//////////////////////////////////////////////////

//shuffle data array
function shuffleZipCodes(arr) {
  var i = arr.length, tempValue, randomIndex;
  while (i !== 0) {
    randomIndex = Math.floor(Math.random() * i);
	  i--;
		tempValue = arr[i];
		arr[i] = arr[randomIndex];
		arr[randomIndex] = tempValue;
	}
  return arr;
}

//create new array with 10 zipcodes from randomized data array
function randomTen() {
  var randomTenArr = [];
  shuffleZipCodes(zipCodes);
  for (var i = 0; i < 10; i++) {
    randomTenArr.push(zipCodes[i]);
  }
  return randomTenArr;
  }






var zipCodes = [
    {
      "zip_code": "08723",
      "distance": 49.568,
      "city": "Brick",
      "state": "NJ"
    },
    {
      "zip_code": "08701",
      "distance": 47.757,
      "city": "Lakewood",
      "state": "NJ"
    },
    {
      "zip_code": "08742",
      "distance": 46.398,
      "city": "Point Pleasant Beach",
      "state": "NJ"
    },
    {
      "zip_code": "08724",
      "distance": 46.296,
      "city": "Brick",
      "state": "NJ"
    },
    {
      "zip_code": "08730",
      "distance": 44.72,
      "city": "Brielle",
      "state": "NJ"
    },
    {
      "zip_code": "08527",
      "distance": 48.258,
      "city": "Jackson",
      "state": "NJ"
    },
    {
      "zip_code": "08736",
      "distance": 43.674,
      "city": "Manasquan",
      "state": "NJ"
    },
    {
      "zip_code": "08750",
      "distance": 42.716,
      "city": "Sea Girt",
      "state": "NJ"
    },
    {
      "zip_code": "08514",
      "distance": 49.914,
      "city": "Cream Ridge",
      "state": "NJ"
    },
    {
      "zip_code": "08720",
      "distance": 42.843,
      "city": "Allenwood",
      "state": "NJ"
    },
    {
      "zip_code": "07731",
      "distance": 42.932,
      "city": "Howell",
      "state": "NJ"
    },
    {
      "zip_code": "07762",
      "distance": 41.311,
      "city": "Spring Lake",
      "state": "NJ"
    },
    {
      "zip_code": "08526",
      "distance": 48.355,
      "city": "Imlaystown",
      "state": "NJ"
    },
    {
      "zip_code": "07719",
      "distance": 40.392,
      "city": "Belmar",
      "state": "NJ"
    },
    {
      "zip_code": "07715",
      "distance": 40.136,
      "city": "Belmar",
      "state": "NJ"
    },
    {
      "zip_code": "07717",
      "distance": 38.65,
      "city": "Avon By The Sea",
      "state": "NJ"
    },
    {
      "zip_code": "08510",
      "distance": 44.495,
      "city": "Millstone Township",
      "state": "NJ"
    },
    {
      "zip_code": "07720",
      "distance": 37.945,
      "city": "Bradley Beach",
      "state": "NJ"
    },
    {
      "zip_code": "07727",
      "distance": 38.583,
      "city": "Farmingdale",
      "state": "NJ"
    },
    {
      "zip_code": "08691",
      "distance": 48.792,
      "city": "Trenton",
      "state": "NJ"
    },
    {
      "zip_code": "07710",
      "distance": 39.655,
      "city": "Adelphia",
      "state": "NJ"
    },
    {
      "zip_code": "07754",
      "distance": 37.609,
      "city": "Neptune",
      "state": "NJ"
    },
    {
      "zip_code": "07756",
      "distance": 37.232,
      "city": "Ocean Grove",
      "state": "NJ"
    },
    {
      "zip_code": "07753",
      "distance": 37.268,
      "city": "Neptune",
      "state": "NJ"
    },
    {
      "zip_code": "08555",
      "distance": 44.42,
      "city": "Roosevelt",
      "state": "NJ"
    },
    {
      "zip_code": "07728",
      "distance": 39.309,
      "city": "Freehold",
      "state": "NJ"
    },
    {
      "zip_code": "07709",
      "distance": 35.974,
      "city": "Red Bank",
      "state": "NJ"
    },
    {
      "zip_code": "07711",
      "distance": 35.388,
      "city": "Allenhurst",
      "state": "NJ"
    },
    {
      "zip_code": "08535",
      "distance": 41.777,
      "city": "Millstone Township",
      "state": "NJ"
    },
    {
      "zip_code": "07712",
      "distance": 34.74,
      "city": "Asbury Park",
      "state": "NJ"
    },
    {
      "zip_code": "07723",
      "distance": 34.612,
      "city": "Deal",
      "state": "NJ"
    },
    {
      "zip_code": "08561",
      "distance": 46.177,
      "city": "Windsor",
      "state": "NJ"
    },
    {
      "zip_code": "08520",
      "distance": 44.236,
      "city": "Hightstown",
      "state": "NJ"
    },
    {
      "zip_code": "07755",
      "distance": 33.677,
      "city": "Oakhurst",
      "state": "NJ"
    },
    {
      "zip_code": "08550",
      "distance": 45.928,
      "city": "Princeton Junction",
      "state": "NJ"
    },
    {
      "zip_code": "07722",
      "distance": 33.683,
      "city": "Colts Neck",
      "state": "NJ"
    },
    {
      "zip_code": "07726",
      "distance": 37.2,
      "city": "Englishtown",
      "state": "NJ"
    },
    {
      "zip_code": "08648",
      "distance": 49.714,
      "city": "Lawrence Township",
      "state": "NJ"
    },
    {
      "zip_code": "07764",
      "distance": 31.994,
      "city": "West Long Branch",
      "state": "NJ"
    }
  ]
}
