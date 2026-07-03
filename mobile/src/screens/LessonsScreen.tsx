import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useStore } from '../store/useStore';

const LessonsScreen = () => {
  const { lessons, isLoading, error, actions } = useStore();

  useEffect(() => {
    actions.fetchLessons();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Title>{item.title}</Title>
      <Paragraph>{item.description}</Paragraph>
      <Text style={styles.meta}>
        {item.type === 'unit' ? 'Letters' : 'Lessons'} • {item.lessons?.length || 0} lessons
      </Text>
    </Card>
  );

  if (isLoading) return (
    <View style={styles.centered}>
      <Text>Loading lessons...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.centered}>
      <Text style={styles.error}>Error: {error}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No lessons available</Text>}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => actions.fetchLessons()}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});

export default LessonsScreen;