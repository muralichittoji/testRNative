import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_KEY = 'CALENDAR_EVENTS';
const NOTIF_KEY = 'CALENDAR_SEEN';

export default function Calenders() {
  const [markedDates, setMarkedDates] = useState<any>({});
  const [calendarSeen, setCalendarSeen] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<string[]>(
    [],
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const loadEvents = async () => {
      const savedEvents = await AsyncStorage.getItem(EVENTS_KEY);
      const events = savedEvents ? JSON.parse(savedEvents) : {};

      const formattedMarkedDates: any = {};
      for (const date in events) {
        formattedMarkedDates[date] = {marked: true, dotColor: 'red'};
      }

      setMarkedDates(formattedMarkedDates);
    };

    const checkSeen = async () => {
      const seen = await AsyncStorage.getItem(NOTIF_KEY);
      setCalendarSeen(seen === 'true');
    };

    loadEvents();
    checkSeen();
  }, []);

  const handleDatePress = async (day: any) => {
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);

    // Get the events for the selected date
    const savedEvents = await AsyncStorage.getItem(EVENTS_KEY);
    const events = savedEvents ? JSON.parse(savedEvents) : {};

    if (events[selectedDate]) {
      setEventsForSelectedDate(events[selectedDate]);
    } else {
      setEventsForSelectedDate([]);
    }

    // Show the modal
    setModalVisible(true);

    // After accessing the calendar, remove the red dot
    await AsyncStorage.setItem(NOTIF_KEY, 'true');
    setCalendarSeen(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDatePress}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={{
          todayTextColor: 'blue',
          selectedDayBackgroundColor: 'green',
          selectedDayTextColor: 'white',
        }}
      />
      {!calendarSeen && <Text style={styles.redDot}>•</Text>}

      {/* Modal for displaying events */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Events on {selectedDate}</Text>
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map((event, index) => (
                <Text key={index} style={styles.eventText}>
                  - {event}
                </Text>
              ))
            ) : (
              <Text>No events for this date</Text>
            )}

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  redDot: {
    color: 'red',
    fontSize: 40,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventText: {
    fontSize: 16,
    marginVertical: 5,
    backgroundColor: '#c6c6c6',
    width: '100%',
    textAlign: 'center',
    borderRadius: 5,
    color: '#000',
    paddingVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
