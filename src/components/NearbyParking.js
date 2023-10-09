import haversineDistance from "haversine-distance";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function NearbyParking({ desiredLocation, parkingData }) {
  const [nearbyParkingLocations, setNearbyParkingLocations] = useState([]);
  const navigation = useNavigation();
  const [savedMessageVisible, setSavedMessageVisible] = useState(false);

  const calculateDistance = (coord1, coord2) => {
    const distance = haversineDistance(coord1, coord2);
    return distance; // Distance in meters
  };

  // Define a threshold distance in kilometers
  const thresholdDistance = 1;

  useEffect(() => {
    // Filter parking locations that are nearby
    const nearbyParking = parkingData.filter((parkingLocation) => {
      const parkingCoord = {
        latitude: parseFloat(parkingLocation.Location.split(" ")[0]),
        longitude: parseFloat(parkingLocation.Location.split(" ")[1]),
      };
      const distance = calculateDistance(desiredLocation, parkingCoord);
      return distance <= thresholdDistance * 1500; // Convert km to meters
    });

    // Set the list of nearby parking locations
    setNearbyParkingLocations(nearbyParking);
  }, [desiredLocation, parkingData]);

  const storeParkingChoice = async (selectedLocation, key) => {
    try {
      // Retrieve the existing choices from AsyncStorage
      const existingChoices = await AsyncStorage.getItem(key);

      // Parse the existing choices as JSON (or initialize an empty array)
      const choices = existingChoices ? JSON.parse(existingChoices) : [];

      // Add the new choice to the array
      choices.push(selectedLocation);

      // Store the updated choices back in AsyncStorage using the provided key
      await AsyncStorage.setItem(key, JSON.stringify(choices));
    } catch (error) {
      console.error("Error storing parking choice:", error);
    }
  };

  const handleLocationClick = (location) => {
    // Store the location as a regular parking choice
    storeParkingChoice(location, "regularParkingChoices");

    navigation.navigate("ParkingDetails", {
      selectedLocation: location,
    });
  };

  // Function to handle saving parking location
  const handleSaveParkingLocation = (location) => {
    // Store the location as a saved parking choice
    storeParkingChoice(location, "savedParkingChoices");
    setSavedMessageVisible(true);

    setTimeout(() => {
      setSavedMessageVisible(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Parking Locations:</Text>
      {savedMessageVisible && (
        <View style={styles.savedMessageContainer}>
          <Text style={styles.savedMessageText}>Location saved!</Text>
        </View>
      )}
      {nearbyParkingLocations.length ? (
        <FlatList
          data={nearbyParkingLocations}
          keyExtractor={(item) => item.CarParkID}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLocationClick(item)}>
              <View style={styles.locationItem}>
                <Text style={styles.locationName}>{item.Development}</Text>
                {/* Custom-styled "Save" button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveParkingLocation(item)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noParkingContainer}>
          <Text style={styles.noParkingText}>
            No available parking spots nearby.
          </Text>
          <Text style={styles.noParkingText}>
            Please try searching for a different location in Singapore.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7", // Background color
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#333", // Text color
  },
  locationItem: {
    marginBottom: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd", // Border color
    borderRadius: 8,
    backgroundColor: "#fff", // Background color
    flexDirection: "row", // Display button and text in a row
    alignItems: "center", // Vertically center items
  },
  locationName: {
    flex: 1, // Allow location name to take remaining horizontal space
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333", // Text color
  },
  saveButton: {
    backgroundColor: "#007AFF", // Customize button background color
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#fff", // Button text color
    fontWeight: "bold",
  },
  savedMessageContainer: {
    backgroundColor: "#4CAF50", // Background color for saved message
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "center", // Centered horizontally
    marginVertical: 10, // Adjust as needed
  },
  savedMessageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  availableLots: {
    fontSize: 14,
    color: "#666", // Text color
  },
  noParkingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noParkingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default NearbyParking;
