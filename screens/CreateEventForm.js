import React, { useState, Component } from 'react';
import { View, Button, Platform, TextInput, Text, StyleSheet, Alert } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import firebase from "../config/Firebase";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import RNPickerSelect from 'react-native-picker-select';

export default class eventMaker extends Component {

  constructor(props) {
    super(props)
    this.userid = firebase.auth().currentUser.uid
    this.locationGroupKey = '',

      this.state = {
        date: '',
        duration: '',
        hour: '',
        title: '',
        eventType: '',
        location: '',
        Location_list: [],
      }
    this.items = []
    this.data = [{
      value: 'GLOBAL',
    }, {
      value: 'LOCAL',
    }, {
      value: 'OTHERS',
    }]
    // this.locationData = [{
    //   value: 'jerusalem',
    // }, {
    //   value: 'telaviv',
    // }, {
    //   value: 'surbaher',
    // }];

  }

  componentDidMount() {
    firebase.firestore().collection('Groups').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.data().key !== 'journalists' && doc.data().key !== 'resources' &&
          doc.data().key !== 'donations' && doc.data().key !== 'relations'
          && doc.data().key !== 'mainGroup') {
          this.items.push({
            label: doc.data().name, value: doc.data().key
          });
        }
      })
      this.setState({ Location_list: this.items });
    })
  }

  createGroup() {


    let newkey = uuidv4()
    let ref
    if (this.state.eventType === 'LOCAL') {
      // if local get location name and change state
      firebase.firestore().collection('Groups').doc(this.locationGroupKey).get().then(doc => {
        this.setState({ location: doc.data().name })
      })
    } else {
      // if global make group key= mainGroup
      this.locationGroupKey = 'mainGroup'
      this.setState({ location: 'mainGroup' })
    }
    
    ref = firebase.firestore().collection('Groups').doc(this.locationGroupKey).collection('subGroups').doc(newkey)

    ref.set({
      admins: [this.userid],
      clicked: false,
      content: '',
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      image_uri: '',
      key: newkey,
      name: this.state.title,
      users: [this.userid],
      event: true
    })
    ref.collection('messages').add({
      _id: uuidv4(),
      text: 'New Event Group Created!',
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      system: true,
    })
    firebase.firestore().collection('Groups').doc(this.locationGroupKey).collection('messages').add({
      _id: uuidv4(),
      text: 'New Event Created! Go to the Calendar to join the Event Group',
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      system: true,
    })
    firebase.firestore().collection('Events').add({
      date: this.state.date,
      duration: this.state.duration,
      hour: this.state.hour,
      title: this.state.title,
      eventType: this.state.eventType,
      location: this.state.location
    });
    this.props.navigation.pop('Calendar');
    this.props.navigation.push('Calendar');
  }

  render() {
    return (
      <View>
        <View style={{ padding: 50 }}>
          <View style={{ margin: 10 }}>
            <Text style={{ textAlign: "center" }}>ADD NEW EVENT</Text>
          </View>
          <View style={{ margin: 10 }}>
            <TextInput placeholder="title"
              onChangeText={title => this.setState({ title: title })}
              value={this.state.title}
            />
          </View>
          <View style={{ margin: 10 }}>
            <TextInput placeholder={"Date: yyyy-mm-dd"}
              onChangeText={date => this.setState({ date: date })}
              value={this.state.date}
            //keyboardType = {"numeric"}

            />
          </View>
          <View style={{ margin: 10 }}>
            <TextInput placeholder="At what hour is the event?"
              onChangeText={Hour => this.setState({ hour: Hour })}
              value={this.state.hour}
            />
          </View>
          <View style={{ margin: 10 }}>
            <TextInput placeholder="Duration"
              onChangeText={Duration => this.setState({ duration: Duration })}
              value={this.state.duration}
            />
          </View>
          <View style={{ margin: 10 }}>
            <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              // value={this.state.location}
              placeholder={{ label: "Select a Location", value: null }}
              onValueChange={location => {
                console.log('loc:', location)
                if (location === null) {
                  alert('Please select a city')
                } else {
                  this.locationGroupKey = location
                  this.setState({ location })
                }
              }}
              items={this.state.Location_list}
            ></RNPickerSelect>
          </View>
          <View>
            <View style={{ margin: 10 }}>

              <Dropdown
                label='CHOOSE EVENT TYPE: '
                data={this.data}
                onChangeText={type => this.setState({ eventType: type })}
                value={this.state.eventType}
              />
            </View>
          </View>
        </View>
        <View>
          <Button title='CONFIRM' style={{ position: 'absolute', bottom: 0 }}
            onPress={() => {
              this.createGroup()
            }} />
        </View>
      </View>

    );
  };
}



