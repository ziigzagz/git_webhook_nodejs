function google_map(){
    const googleMapsClient = require('@google/maps').createClient({
        key: 'AIzaSyDfbDDI9ReFb1Yi1u6UMMImwYk4aHCDlFc', // Replace with your Google Maps API Key
      });
      
      // Define the location (latitude and longitude) and radius for your search.
      const location = { lat: 37.7749, lng: -122.4194 }; // Example: San Francisco, CA
      const radius = 1000; // Search radius in meters
      
      // Define the type of places you're looking for (e.g., 'restaurant', 'coffee_shop', 'hospital').
      const type = 'restaurant';
      
      googleMapsClient.placesNearby(
        {
          location,
          radius,
          type,
        },
        (error, response) => {
          if (!error) {
            console.log(places)
            const places = response.json.results;
            for (const place of places) {
              console.log(place.name, place.vicinity);
            }
          } else {
            console.error('Error:', error);
          }
        }
      );
      
}

// export module
module.exports = {
    google_map
}