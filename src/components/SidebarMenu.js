import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { navigate } from "./RootNavigation"; // Import navigation service

const SidebarMenu = ({ isVisible, onClose }) => {
  const handleRecentParkingChoicesClick = () => {
    navigate("Recent Parking Choices"); // Navigate to the RecentParkingChoices screen
    onClose(); // Close the sidebar menu
  };

  handleSavedtParkingLocationsClick;
  const handleSavedtParkingLocationsClick = () => {
    navigate("Saved Parking Locations"); // Navigate to the Saved Parking Locations screen
    onClose(); // Close the sidebar menu
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose} // Close the menu when tapping outside
      backdropOpacity={0.5}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleRecentParkingChoicesClick}
          style={styles.menuButton}
        >
          <Text style={styles.menuItem}>Recent Parking Choices</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSavedtParkingLocationsClick}
          style={styles.menuButton}
        >
          <Text style={styles.menuItem}>Saved Parking Locations</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingTop: 40, // Adjust the top padding to position the menu button
  },
  menuButton: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuItem: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default SidebarMenu;
