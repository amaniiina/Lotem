import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import firebase from "../config/Firebase"
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import {Thumbnail,Container,Content} from 'native-base'
import Users from './ChooseUsersList';
import styles from '../styles/styles';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default class RNF extends Component {
  constructor(props) {
    super(props)
    this.userid = firebase.auth().currentUser.uid
    this.groupUsers = props.route.params.group.users.filter(uid => uid !== this.userid)
    this.groupKey = props.route.params.group.key

    this.state = {
      groupName: '',
      loading: false,
      dp: 'https://lh3.googleusercontent.com/kEm74bvpG9r2gt-LaG-zKBYJb_chHGAbieyX0sPHNMtpAloZgRO6fGO2tY1Hd1gm8PQ',
      selected: [],
    }
  }

  createGroup() {
    let newkey = uuidv4()
    let ref = firebase.firestore().collection('Groups').doc(this.groupKey).collection('subGroups').doc(newkey)
    this.setState(prevState => {
      const selected = prevState.selected.push(this.userid)
      return selected
    }, () => {
      ref.set({
        admins: [this.userid],
        clicked: false,
        content: '',
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        image_uri: this.state.dp,
        key: newkey,
        name: this.state.groupName,
        users: this.state.selected,
        event: false
      })
      ref.collection('messages').add({
        _id: uuidv4(),
        text: 'New Group Created!',
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        system: true,
    })
      navigation.navigate("groupsList")
    })
  }


  openPicker() {
    //for the Loading symbol to appear
    this.setState({ loading: true })
    /* Convert image into blob format (related with transfer to and from firebase )*/
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
    /* */
    const uid =  uuidv4()
    //after cropping the image will have width,height as noted below 
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      avoidEmptySpaceAroundImage: true,
      cropperCircleOverlay: true,
      mediaType: 'photo'
    }).then(image => {

      const imagePath = image.path

      let uploadBlob = null
      //reference to firebase storage 
      const imageRef = firebase.storage().ref(this.groupKey).child(uid)
      let mime = 'image/jpg'
      fs.readFile(imagePath, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          //upload to firebase
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          let obj = {}
          obj["loading"] = false
          // url= firebase download url 
          obj["dp"] = url
          this.setState(obj)

        })
        .catch((error) => {
          console.log(error)
        })
    })
      .catch((error) => {
        console.log(error)
      })
  }


  render() {
    const dpr = this.state.dp ? (<Thumbnail style={styles.thumb} source={{ uri: this.state.dp }} />) : (<Thumbnail style={styles.thumb} source={{ uri: 'https://lh3.googleusercontent.com/kEm74bvpG9r2gt-LaG-zKBYJb_chHGAbieyX0sPHNMtpAloZgRO6fGO2tY1Hd1gm8PQ' }} />)

    return (
      <Container >
        <Content>
          <View style={{ margin: 20, flexDirection: "row", alignItems: 'center' }}>
            {dpr}
            <View style={{ height: 80, flexDirection: 'column' , marginTop:25}}>
              <TextInput
                maxLength={30}
                placeholder='type group name...'
                onChangeText={(groupName) => this.setState({ groupName })}
                style={
                  styles.input
                }
              />
              <Text style={styles.txt}>Provide a group name and optional group icon</Text>
            </View>
          </View>
          <Button
            onPress={() => this.openPicker()}
            title={"Change group picture"}
            style={styles.changeBtn}
          />
          <Users users={this.groupUsers} selected={this.state.selected} />
        </Content>
        <Button onPress={() => this.createGroup()}
          title='Create Group'
          style={{ position: 'absolute', bottom: 0 }} />
      </Container>
    );
  }
}