import _ from 'lodash';
import React, { Component } from 'react';

import { Platform, Alert, StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import firebase from "../config/Firebase";
import { decode, encode } from 'base-64'

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}


const calendarHelper = require('./calendarHelper');

const db = firebase.firestore();

firebase.firestore().collection('Events').get().then(() => {
  console.log('firebase is working');
});


const today = new Date().toISOString().split('T')[0];
const fastDate = getPastDate(10);//ask fo the previous date
const futureDates = getFutureDates(9);//ask for future DATES
const dates = [fastDate, today].concat(futureDates);
const themeColor = '#00AAAF';
const lightThemeColor = '#EBF9F9';

function getFutureDates(days) {
  const array = [];
  for (let index = 1; index <= days; index++) {
    const date = new Date(Date.now() + (864e5 * index)); // 864e5 == 86400000 == 24*60*60*1000

    const dateString = date.toISOString().split('T')[0];
    array.push(dateString);
  }
  return array;
}

function getPastDate(days) {
  return new Date(Date.now() - (864e5 * days)).toISOString().split('T')[0];
}

// const ITEMS = [
//   { title: dates[0], data: [{ hour: '12am', duration: '1h', title: 'lotim meeting on zoom' }] },
//   { title: dates[1], data: [{ hour: '4pm', duration: '1h', title: 'מחאה בירושלים' }, { hour: '5pm', duration: '1h', title: 'lotim meeting on zoom' }] },
//   { title: dates[2], data: [{ hour: '1pm', duration: '1h', title: 'מחאה באשדוד' }, { hour: '2pm', duration: '1h', title: 'לרקוד' }, { hour: '3pm', duration: '1h', title: 'מפגש לאמהות' }] },
//   { title: dates[3], data: [{ hour: '12am', duration: '1h', title: 'مظاهرة في القدس' }] },
//   { title: dates[4], data: [{}] },
//   { title: dates[5], data: [{ hour: '9pm', duration: '1h', title: 'مظاهرة في القدس' }, { hour: '10pm', duration: '1h', title: 'מפגש לאישות בסיכון' }, { hour: '11pm', duration: '1h', title: 'תכנון למחאה' }, { hour: '12pm', duration: '1h', title: 'lotim meeting' }] },
//   { title: dates[6], data: [{ hour: '12am', duration: '1h', title: 'מחאה באשדוד' }] },
//   { title: dates[7], data: [{}] },
//   { title: dates[8], data: [{ hour: '9pm', duration: '1h', title: 'מחאה באשדוד' }, { hour: '10pm', duration: '1h', title: 'מחאה בירושלים' }, { hour: '11pm', duration: '1h', title: 'תכנון למחאה' }, { hour: '12pm', duration: '1h', title: 'meeting' }] }
// ];


export default class ExpandableCalendarScreen extends Component {

  constructor(props) {
    super(props)
    this.ITEMS = [{ title: new Date(), data: [{ hour: 'press', duration: 'join', title: 'LOTEM MAIN GROUP' }] }];
    this.userid=firebase.auth().currentUser.uid
    this.state = {
      ITEMS: this.ITEMS,
      isFetching: true
    }
  }

  //add the events from firebase
  componentDidMount() {

    //console.log('addNewEventFromDB.data.hour before editing = ' + addNewEventFromDB.data.hour);
    firebase.firestore().collection('Events').get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        var today = new Date().toISOString().split('T')[0];
        var eventDate = doc.data().date;
        if (eventDate >= today) //render the new events
        {
          let addNewEventFromDB = { title: '', data: [{ hour: '', duration: '', title: '', location: '' }] };
          console.log(doc.data().hour);
          //add one event to variable
          addNewEventFromDB.title = doc.data().date;
          addNewEventFromDB.data[0].hour = doc.data().hour;
          addNewEventFromDB.data[0].duration = doc.data().duration;
          addNewEventFromDB.data[0].title = doc.data().title;
          addNewEventFromDB.data[0].location = doc.data().location;
          this.ITEMS.push(addNewEventFromDB);
          this.setState({ isFetching: false });
        }
      });
    });

  }

  onDateChanged = (/* date, updateSource */) => {
    // console.warn('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
    // fetch and set data for date + week ahead
  }

  onMonthChange = (/* month, updateSource */) => {
    // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
  }

  buttonPressed(location, title) {
    var groupRef
    firebase.firestore().collection('Groups').doc(location).collection('subGroups').where('name', '==', title).get().then((querySnapshot)=> {
      querySnapshot.forEach((doc) => {
        groupRef = doc.id
      if(doc.data().users.includes(this.userid)){ // changed not working
        Alert.alert('You are already part of this group!')
      }

      })
    }).then(() => {
      firebase.firestore().collection('Groups').doc(location).collection('subGroups').doc(groupRef)
        .update(
          'users', firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid))
    })
    this.props.navigation.navigate("Groups")
  }

  // isUserinGroup(location,title){
  //   firebase.firestore().collection('Groups').doc(location).collection('subGroups').where('name', '==', title).get().then(function (querySnapshot) {
  //     querySnapshot.forEach((doc) => {
  //       return doc.data().users.includes(this.userid)
  //     })
  //   })
    
  // }

  itemPressed(loc) {
    Alert.alert(`Event in ${loc}`);
  }

  renderEmptyItem() {
    return (
      <View style={styles.emptyItem}>

        <Text style={styles.emptyItemText}>No Events Planned</Text>
      </View>
    );
  }

  renderItem = ({ item }) => {
    if (_.isEmpty(item)) {
      return this.renderEmptyItem();
    }

    return (
      <View>

        <View>
          <TouchableOpacity
            onPress={() => this.itemPressed(item.location)}
            style={styles.item}
          >
            <View>
              <Text style={styles.itemHourText}>{item.hour}</Text>
              <Text style={styles.itemDurationText}>{item.duration}</Text>
            </View>
            <Text style={styles.itemTitleText}>{item.title}</Text>
            <View style={styles.itemButtonContainer}>
              {/* {this.isUserinGroup(item.location, item.title) ?  null: */}
                 <Button color={'grey'} title={'Join'}
                  onPress={() => this.buttonPressed(item.location, item.title)} />
              {/* } */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  getMarkedDates = () => {
    const marked = {};
    this.ITEMS.forEach(item => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
        marked[item.title] = { marked: true };
      }
    });

    return marked;
  }

  getTheme = () => {
    const disabledColor = 'grey';

    return {
      // arrows
      arrowColor: 'black',
      arrowStyle: { padding: 0 },
      // month
      monthTextColor: 'black',
      textMonthFontSize: 16,
      textMonthFontFamily: 'HelveticaNeue',
      textMonthFontWeight: 'bold',
      // day names
      textSectionTitleColor: 'black',
      textDayHeaderFontSize: 12,
      textDayHeaderFontFamily: 'HelveticaNeue',
      textDayHeaderFontWeight: 'normal',
      // dates
      dayTextColor: themeColor,
      textDayFontSize: 18,
      textDayFontFamily: 'HelveticaNeue',
      textDayFontWeight: '500',
      textDayStyle: { marginTop: Platform.OS === 'android' ? 2 : 4 },
      // selected date
      selectedDayBackgroundColor: themeColor,
      selectedDayTextColor: 'white',
      // disabled date
      textDisabledColor: disabledColor,
      // dot (marked date)
      dotColor: themeColor,
      selectedDotColor: 'white',
      disabledDotColor: disabledColor,
      dotStyle: { marginTop: -2 }
    };
  }

  render() {
    return (
      <CalendarProvider
        date={this.ITEMS[0].title}
        onDateChanged={this.onDateChanged}
        onMonthChange={this.onMonthChange}
        showTodayButton
        disabledOpacity={0.6}
      >
        {this.props.weekView ?
          <WeekCalendar
            testID={calendarHelper.weekCalendar.CONTAINER}
            firstDay={1}
            markedDates={this.getMarkedDates()}
          /> :
          <View>
            <Button title={'Add new event'} onPress={() => this.props.navigation.navigate('CreateEvent')} />
            <ExpandableCalendar
              testID={calendarHelper.expandableCalendar.CONTAINER}
              initialPosition={ExpandableCalendar.positions.OPEN}
              firstDay={1}
              markedDates={this.getMarkedDates()} // {'2019-06-01': {marked: true}, '2019-06-02': {marked: true}, '2019-06-03': {marked: true}};
            />
          </View>
        }
        <AgendaList
          sections={this.ITEMS}
          extraData={this.state}
          renderItem={this.renderItem}
        />
      </CalendarProvider>
    );
  }
}


const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  },
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row'
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  }
});
