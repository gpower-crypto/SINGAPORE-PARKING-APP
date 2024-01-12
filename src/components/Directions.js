// Import necessary libraries
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";

// Define the Directions component
const Directions = ({ route }) => {
  // Extract origin and destination from route params
  const { origin, destination } = route.params;
  const apiKey = "###";

  // State to store the decoded route polyline
  const [routePolyline, setRoutePolyline] = useState([]);

  // Effect to fetch route polyline when origin or destination changes
  useEffect(() => {
    // Fetch route polyline from Geoapify Routing API
    const fetchRoutePolyline = async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/routing?waypoints=${origin.latitude},${origin.longitude}|${destination.latitude},${destination.longitude}&mode=drive&apiKey=${apiKey}`
        );

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const { coordinates } = data.features[0].geometry;

          // Flatten the nested array and format coordinates
          const flattenedCoordinates = coordinates.flat(2);
          const routePoints = [];

          for (let i = 0; i < flattenedCoordinates.length; i += 2) {
            routePoints.push({
              latitude: flattenedCoordinates[i + 1],
              longitude: flattenedCoordinates[i],
            });
          }

          setRoutePolyline(routePoints);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoutePolyline();
  }, [origin, destination, apiKey]);

  // Render the map with markers and polyline
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={origin} pinColor="green" title="Origin" />
        <Marker coordinate={destination} pinColor="red" title="Destination" />

        {/* Draw the route polyline on the map */}
        <Polyline
          coordinates={routePolyline}
          strokeColor="dodgerblue"
          strokeWidth={7}
        />
      </MapView>
    </View>
  );
};

// Stylesheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

// Export the Directions component
export default Directions;
