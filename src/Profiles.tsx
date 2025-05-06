import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const EVENTS_KEY = 'CALENDAR_EVENTS';
const NOTIF_KEY = 'CALENDAR_SEEN';

export default function Profiles() {
  const [eventText, setEventText] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddEvent = async () => {
    const formattedDate = date.toISOString().split('T')[0];

    // Get stored events from AsyncStorage
    const storedEvents = await AsyncStorage.getItem(EVENTS_KEY);
    const events = storedEvents ? JSON.parse(storedEvents) : {};

    // Add event to the selected date
    if (!events[formattedDate]) {
      events[formattedDate] = [];
    }

    events[formattedDate].push(eventText);
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    // Mark the calendar as having an event
    await AsyncStorage.setItem(NOTIF_KEY, 'false');

    setEventText('');
    Alert.alert('Event added!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Calendar Event</Text>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        value={eventText}
        placeholder="Enter event"
        onChangeText={setEventText}
      />

      <Button
        title="Add Event"
        onPress={handleAddEvent}
        disabled={!eventText.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 12},
  dateButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {fontSize: 16},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});
