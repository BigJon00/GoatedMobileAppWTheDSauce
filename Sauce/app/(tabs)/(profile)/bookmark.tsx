import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

// import our favorites function
import { getFavorites } from "@/database/favorites";
import { Location } from "@/interfaces/interfaces";

const Bookmark = () => {
  const [favorites, setFavorites] = useState<Location[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  // Loading the favorites to which gets placed in the flatList
  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite Locations</Text>

      {/*Pretty much to show that there's no favorite you added. */}
      {favorites.length === 0 ? (
        <Text style={styles.empty}>No favorites yet</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  desc: {
    fontSize: 12,
    color: "#555",
  },
});