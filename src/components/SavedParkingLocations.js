import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useUserLocation } from "./UserLocationContext";
import fetchParkingData from "./ParkingDataLoader"; // Import fetch parking data function

function SavedParkingLocations() {
  const [savedLocations, setSavedLocations] = useState([]);
  const navigation = useNavigation();
  const userLocation = useUserLocation(); // Use the user location context
  const [parkingData, setParkingData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch parking data
        const data = await fetchParkingData();
        const uniqueData = data.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.CarParkID === item.CarParkID)
        );
        setParkingData(uniqueData);

        // Fetch the stored parking choices from AsyncStorage
        const storedChoices = await AsyncStorage.getItem("savedParkingChoices");

        if (storedChoices) {
          const parsedChoices = JSON.parse(storedChoices);
          // Filter out duplicate choices based on their unique CarParkID
          const uniqueChoices = filterUniqueChoices(parsedChoices, uniqueData);

          setSavedLocations(uniqueChoices);
        }

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to filter out duplicate choices based on their unique identifier and location
  const filterUniqueChoices = (choices, parkingData) => {
    const uniqueChoices = [];
    const uniqueIds = new Set();

    for (const choice of choices) {
      if (!uniqueIds.has(choice.CarParkID)) {
        uniqueIds.add(choice.CarParkID);
        const matchingLocation = parkingData.find(
          (location) => location.CarParkID === choice.CarParkID
        );
        if (matchingLocation) {
          uniqueChoices.push(matchingLocation);
        }
      }
    }

    return uniqueChoices;
  };

  const handleLocationClick = (location) => {
    // Navigate to the "ParkingDetails" screen and pass the selected location and user location
    navigation.navigate("ParkingDetails", {
      selectedLocation: location,
      userLocation: userLocation, // Use the user location from the context
    });
  };

  if (!isDataLoaded) {
    // return a loading indicator here until the data is loaded
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Parking Locations:</Text>
      {savedLocations.length ? (
        <FlatList
          data={savedLocations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLocationClick(item)}>
              <View style={styles.locationItem}>
                <Text>{item.Development}</Text>
                <Text>Available Lots: {item.AvailableLots}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noLocationsSavedContainer}>
          <Text style={styles.noLocationsSavedText}>
            No saved parking locations yet.
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
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  locationItem: {
    marginBottom: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  noLocationsSavedContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noLocationsSavedText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default SavedParkingLocations;
