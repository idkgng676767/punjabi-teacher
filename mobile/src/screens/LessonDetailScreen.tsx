import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, IconButton, Button, Avatar, List, Divider } from 'react-native-paper';
import { useStore } from '../store/useStore';
import * as Audio from 'expo-av';

const LessonDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonDetail, isLoading, error, fetchLesson, completeLesson, user } = useStore();
  const [sound, setSound] = useState(null);

  const { id } = route.params ?? {};

  useEffect(() => {
    const loadLesson = async () => {
      if (id) {
        await fetchLesson(id);
      }
    };

    loadLesson();

    // Clean up audio on unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id, fetchLesson]);

  const playAudio = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF9933" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
        <Button mode="contained" onPress={() => fetchLesson(id)}>Retry</Button>
      </View>
    );
  }

  if (!lessonDetail) {
    return (
      <View style={styles.centered}>
        <Text>No lesson found</Text>
      </View>
    );
  }

  const renderLetterUnit = () => {
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            color="#FF9933"
            size={24}
          />
          <Text style={styles.backText}>Back to Lessons</Text>
        </View>
        <Text style={styles.title}>{lessonDetail.title}</Text>
        <Text style={styles.description}>{lessonDetail.description}</Text>
        <View style={styles.lettersGrid}>
          {lessonDetail.letters?.map((letter) => (
            <View key={letter.id} style={styles.letterCard}>
              <View style={styles.letterCharacter}>
                <Text style={styles.letterText}>{letter.character}</Text>
              </View>
              <View style={styles.letterInfo}>
                <Text style={styles.letterInfoText}>{letter.transliteration}</Text>
                <Text style={styles.letterInfoText}>{letter.pronunciation}</Text>
                <View style={styles.letterExampleContainer}>
                  <Text style={styles.letterExampleText}>
                    <strong>{letter.exampleWord}</strong> ({letter.exampleMeaning})
                  </Text>
                </View>
                {letter.audioUrl && (
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={() => playAudio(letter.audioUrl)}
                  >
                    <Text style={styles.audioButtonText}>🔊 Play</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
        <Button
          mode="contained"
          style={styles.completeButton}
          onPress={async () => {
            try {
              await completeLesson(id);
              Alert.alert('Success', 'Lesson completed! Earned 10 XP.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to complete lesson');
            }
          }}
        >
          Complete Unit
        </Button>
      </View>
    );
  };

  const renderPhraseLesson = () => {
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            color="#FF9933"
            size={24}
          />
          <Text style={styles.backText}>Back to Lessons</Text>
        </View>
        <Text style={styles.title}>{lessonDetail.title}</Text>
        <Text style={styles.description}>{lessonDetail.description}</Text>
        <View style={styles.phrasesList}>
          {lessonDetail.phrases?.map((phrase) => (
            <View key={phrase.id} style={styles.phraseCard}>
              <View style={styles.phraseContent}>
                <Text style={styles.phrasePunjabi}>{phrase.punjabi}</Text>
                <Text style={styles.phraseTransliteration}>{phrase.transliteration}</Text>
                <Text style={styles.phraseEnglish}>{phrase.english}</Text>
                <Text style={styles.phrasePronunciation}>{phrase.pronunciationTip}</Text>
                {phrase.culturalNote && (
                  <View style={styles.culturalNote}>
                    <Text style={styles.culturalNoteTitle}>Cultural Note:</Text>
                    <Text style={styles.culturalNoteText}>{phrase.culturalNote}</Text>
                  </View>
                )}
                {phrase.audioUrl && (
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={() => playAudio(phrase.audioUrl)}
                  >
                    <Text style={styles.audioButtonText}>🔊 Play</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
        <Button
          mode="contained"
          style={styles.completeButton}
          onPress={async () => {
            try {
              await completeLesson(id);
              Alert.alert('Success', 'Lesson completed! Earned 10 XP.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to complete lesson');
            }
          }}
        >
          Complete Lesson
        </Button>
      </View>
    );
  };

  const renderNumberLesson = () => {
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            color="#FF9933"
            size={24}
          />
          <Text style={styles.backText}>Back to Lessons</Text>
        </View>
        <Text style={styles.title}>{lessonDetail.title}</Text>
        <Text style={styles.description}>{lessonDetail.description}</Text>
        <View style={styles.numbersGrid}>
          {lessonDetail.numbers?.map((num) => (
            <View key={num.punjabi} style={styles.numberCard}>
              <Text style={styles.numberPunjabi}>{num.punjabi}</Text>
              <Text style={styles.numberTransliterationTransliteration}</Text>
              <Text style={styles.english}</Text>
              <Text  styles.numberPronunciation>num</Text}.number>
      </View>
        )}how  style=styles.complete
             onBu ttonPresst={async { ()=> {
    try {
      await completeLesson(id);
      Alert.alert('Success', 'Lesson completed! Earned 10 XP.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to complete lesson');
    }
  }}
   >
    Complete Lesson
  </Button>
</View>
    );
  };

  const renderWordLesson = () => {
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            color="#FF9933"
            size={24}
          />
          <Text style={styles.backText}>Back to Lessons</Text>
        </View>
        <Text style={styles.title}>{lessonDetail.title}</Text>
        <Text style={styles.description}>{lessonDetail.description}</Text>
        <View style={styles.wordsGrid}>
          {lessonDetail.words?.map((word) => (
            <View key={word.punjabi} style={styles.wordCard}>
              <Text style={styles.wordPunjabi}>{word.punjabi}</Text>
              <Text style={styles.wordTransliteration}>{word.transliteration}</Text>
              <Text style={styles.wordEnglish}>{word.english}</Text>
              <Text style={styles.wordPronunciation}>{word.pronunciation}</Text>
            </View>
          ))}
        </View>
        <Button
          mode="contained"
          style={styles.completeButton}
          onPress={async () => {
            try {
              await completeLesson(id);
              Alert.alert('Success', 'Lesson completed! Earned 10 XP.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to complete lesson');
            }
          }}
        >
          Complete Lesson
        </Button>
      </View>
    );
  };

  const renderDefaultLesson = () => {
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            color="#FF9933"
            size={24}
          />
          <Text style={styles.backText}>Back to Lessons</Text>
        </View>
        <Text style={styles.title}>{lessonDetail.title}</Text>
        <Text style={styles.description}>{lessonDetail.description}</Text>
        <Button
          mode="contained"
          style={styles.completeButton}
          onPress={async () => {
            try {
              await completeLesson(id);
              Alert.alert('Success', 'Lesson completed! Earned 10 XP.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to complete lesson');
            }
          }}
        >
          Complete Lesson
        </Button>
      </View>
    );
  };

  return lessonDetail.type === 'unit' && lessonDetail.letters
    ? renderLetterUnit()
    : lessonDetail.type === 'lesson' && lessonDetail.phrases
    ? renderPhraseLesson()
    : lessonDetail.type === 'lesson' && lessonDetail.numbers
    ? renderNumberLesson()
    : lessonDetail.type === 'lesson' && lessonDetail.words
    ? renderWordLesson()
    : renderDefaultLesson();
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
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FF9933',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  letterCard: {
    width: '45%',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  letterCharacter: {
    marginBottom: 8,
  },
  letterText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  letterInfo: {
    alignItems: 'center',
  },
  letterInfoText: {
    fontSize: 14,
    marginVertical: 2,
  },
  letterExampleContainer: {
    marginTop: 8,
  },
  letterExampleText: {
    fontSize: 14,
  },
  audioButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FF9933',
    borderRadius: 4,
  },
  audioButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  phrasesList: {
    marginBottom: 16,
  },
  phraseCard: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  phraseContent: {
    marginVertical: 4,
  },
  phrasePunjabi: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  phraseTransliteration: {
    fontSize: 14,
    color: '#666',
  },
  phraseEnglish: {
    fontSize: 16,
    marginVertical: 4,
  },
  phrasePronunciation: {
    fontSize: 14,
    color: '#888',
  },
  culturalNote: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 4,
  },
  culturalNoteTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  numberCard: {
    width: '30%',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  numberPunjabi: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  numberTransliteration: {
    fontSize: 14,
    color: '#666',
  },
  numberEnglish: {
    fontSize: 16,
    marginTop: 4,
  },
  numberPronunciation: {
    fontSize: 14,
    color: '#888',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  wordCard: {
    width: '45%',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  wordPunjabi: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  wordTransliteration: {
    fontSize: 14,
    color: '#666',
  },
  wordEnglish: {
    fontSize: 16,
    marginTop: 4,
  },
  wordPronunciation: {
    fontSize: 14,
    color: '#888',
  },
  completeButton: {
    marginTop: 24,
  },
});

export default LessonDetailScreen;