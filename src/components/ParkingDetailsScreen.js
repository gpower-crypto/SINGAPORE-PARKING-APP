import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserLocation } from "./UserLocationContext";
import { googleApiKey } from "../../secrets";

const apiKey = googleApiKey;

const ParkingDetailsScreen = ({ route }) => {
  const { selectedLocation } = route.params; // Get the selectedLocation from the route parameters
  const navigation = useNavigation(); // Access the navigation object
  const userLocation = useUserLocation(); // Use the userLocation from the context

  // Function to handle getting directions
  const handleGetDirections = () => {
    // Extract the destination coordinates from the selectedLocation
    const destinationCoord = {
      latitude: parseFloat(selectedLocation.Location.split(" ")[0]),
      longitude: parseFloat(selectedLocation.Location.split(" ")[1]),
    };

    // Navigate to the "Directions" screen, passing origin, destination, and API key
    navigation.navigate("Directions", {
      origin: userLocation, // User's location
      destination: destinationCoord, // Destination coordinates
      apiKey: apiKey, // Google Maps API key
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking Availability Details</Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.text}>{selectedLocation.Development}</Text>
      <Text style={styles.label}>Available Lots:</Text>
      <Text style={styles.text}>{selectedLocation.AvailableLots}</Text>
      {/* Button to trigger handleGetDirections */}
      <Button
        title="Get Directions"
        onPress={handleGetDirections}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: "bold",
    color: "#666",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 14,
  },
  button: {
    marginTop: 20,
  },
});

export default ParkingDetailsScreen;
