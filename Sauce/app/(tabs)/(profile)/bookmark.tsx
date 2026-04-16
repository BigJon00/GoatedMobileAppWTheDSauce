import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

// import our favorites function
import { getFavorites } from "@/database/favorites";
import { Location } from "@/interfaces/interfaces";

// Implmenting SQLite 
import { getFavoritesSQL, toggleFavoriteSQL } from "@/database/locationSQL";
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';


const Bookmark = () => {
  const [favorites, setFavorites] = useState<Location[]>([]);
  
  const Router = useRouter();

  // Favorties are now reloaded instead of a one time thing 
  useFocusEffect(() => {
    loadFavorites();
  
    return () => {}; // cleanup
  });
  
  // Loading the favorites to which gets placed in the flatList
  // updated to getFavortiesSQL
  const loadFavorites = async () => {
    const favs = await getFavoritesSQL();
    setFavorites(favs);
  };

  // New Feature: Remove favortites from bookmarks creen 
  const handleRemoveFavorite = async (item: any) => {
    await toggleFavoriteSQL(item.id, item.isFavorite);
  
    const updated = await getFavoritesSQL();
    setFavorites(updated);
  };

  return (
    <View style={styles.container}>
  <Text style={styles.header}>Favorite Locations</Text>

  {favorites.length === 0 ? (
    <Text style={styles.empty}>No favorites yet</Text>
  ) : (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>

          <TouchableOpacity
            onPress={() =>
              Router.push({
                pathname: `/search`,
                params: {
                  lat: item.latitude.toString(),
                  lng: item.longitude.toString(),
                },
              })
            }
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemoveFavorite(item)}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>

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

  removeBtn: {
    marginTop: 10,
    alignSelf: "flex-end",
  },

  removeText: {
    color: "red",
    fontWeight: "bold",
  }
});