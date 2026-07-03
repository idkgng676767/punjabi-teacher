import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PunjabiLingo</Text>
      <Card style={styles.card}>
        <Text style={styles.cardContent}>Your journey to learn Punjabi starts here.</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '80%',
    padding: 20,
  },
  cardContent: {
    textAlign: 'center',
  },
});

export default HomeScreen;