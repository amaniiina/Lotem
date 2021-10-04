import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
} from 'react-native';
import { ListItem } from 'react-native-elements'
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import { Thumbnail, Content, Container } from 'native-base';
import styles from '../styles/styles';
import firebase from '../config/Firebase'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Menu, { MenuItem } from 'react-native-material-menu';
import Icons from "react-native-vector-icons/Feather";

export default class GroupInfo extends Component {
  constructor(props) {
    super(props)

    this.userid = this.props.route.params.userid;
    if (this.props.route.params.sub === true) {
      this.group = this.props.route.params.group
      this.parentGroupKey = this.props.route.params.parentGroupKey;
      this.groupRef = firebase.firestore().collection('Groups').doc(this.parentGroupKey)
        .collection('subGroups').doc(this.group.key)
    } else {
      this.parentGroupKey = null
      this.group = this.props.route.params.group
      this.groupRef = firebase.firestore().collection('Groups').doc(this.group.key)
    }

    this.state = {
      selected: [],
      users: [],
      usersData: [],
      loading: false,
      dp: this.group.image_uri,
      isAdmin: true,
    }

  }

  componentDidMount() {
    this.groupRef.get().then(doc => {
      this.setState({ isAdmin: doc.data().admins.includes(this.userid) })
    }).catch((error) => {Alert.alert('please try again later')})

    this.unsubscribe=this.groupRef.onSnapshot(doc => {
      this.setState({ users: doc.data().users })
    })

    firebase.firestore().collection('Users').get()
      .then(querySnapshot => {
        querySnapshot.forEach(user => {
          let index = this.state.users.indexOf(user.data().Uid)
          if (index !== -1) {
            this.setState(prevState => {
              let a;
              if (user.data().Uid == this.userid) {
                a = { name: 'You', avatar_url: user.data().avatar, id: user.data().Uid }
              } else {
                a = { name: user.data().Username, avatar_url: user.data().avatar, id: user.data().Uid }
              }
              const usersData = [...prevState.usersData, a]
              return { usersData }

            })
          }
        })
      }).catch((error) => {Alert.alert('please try again later')})
  }

  openPicker(callback) {
    //for the Loading symbol to appear
    this.setState({ loading: true })
    /* Convert image into blob format (related with transfer to and from firebase )*/
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
    /* */
    const uid = uuidv4()
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
      const imageRef = firebase.storage().ref(this.group.key).child(uid)
      // console.log(imageRef)
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
          callback()
        })
        .catch((error) => {
          console.log(error)
        })
    })
      .catch((error) => {
        console.log(error)
      })
  }

  exitGroup() {
    Alert.alert(
      'Exit Group',
      `Are you sure you want to exit ${this.group.name}?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            this.groupRef.update(
              'users', firebase.firestore.FieldValue.arrayRemove(this.userid)
            )
            this.groupRef.update(
              'admins', firebase.firestore.FieldValue.arrayRemove(this.userid)
            )
            navigation.navigate('groupsList')
          }
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  }

  deleteGroup() {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to permamnently delete ${this.group.name}?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            this.groupRef.delete().then(
              navigation.navigate('groupsList'))
          }
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  }

  removeUser(uid) {
    Alert.alert(
      'Remove User from Group',
      `Are you sure you want to remove this user from ${this.group.name}?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            this.groupRef.update(
              'users', firebase.firestore.FieldValue.arrayRemove(uid)
            )
            this.groupRef.update(
              'admins', firebase.firestore.FieldValue.arrayRemove(uid)
            )
          }
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );

  }

  makeAdmin(uid) {
    this.groupRef.get().then(doc => {
      if (doc.data().admins.includes(uid)) {
        Alert.alert(
          'This user is already an admin',
          '',
          [{
            text: 'OK',
            style: 'cancel'
          }]
        )
      } else {
        Alert.alert(
          'Make User an Admin',
          `Are you sure you want to make this user an admin for ${this.group.name}?`,
          [
            {
              text: 'Yes',
              onPress: () => {

                this.groupRef.update(
                  'admins', firebase.firestore.FieldValue.arrayUnion(uid)
                )
              }
            },
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            }
          ],
          { cancelable: false }
        );
      }
    }).catch((error) => {Alert.alert('please try again later')})

  }

  _menu = []

  hideMenu = (item) => {
    this._menu[item].hide();
  };

  showMenu = (item) => {
    this._menu[item].show();
  };


  render() {
    const dpr = <Thumbnail style={styles.thumb} source={{ uri: this.state.dp }} />

    return (
      <Container >
        <Content>
          <View style={{ margin: 20, flexDirection: "row", alignItems: 'center' }}>
            {dpr}
            <View style={{ height: 50, flexDirection: 'column' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 10, paddingLeft: 10 }}>{this.group.name}</Text>
            </View>
          </View>
          {this.state.isAdmin ?
            <Button
              onPress={() => {
                this.openPicker(() => {
                  this.groupRef.update({ image_uri: this.state.dp }).catch(function (error) {
                      Alert.alert('please check your internet connection')
                    })
                })
              }}
              title={"Change group picture"}
              style={styles.changeBtn}
            />
            : null}
          <View>
            <Text style={{ margin: 20, fontSize: 20 }}>Users</Text>
            {
              this.state.usersData.map((l, i) => (
                <View style={{ flexDirection: 'row' }}>
                  <ListItem
                    style={{ flex: 1 }}
                    key={i}
                    leftAvatar={{ source: { uri: l.avatar_url } }}
                    title={l.name}
                    bottomDivider
                  />
                  {this.state.isAdmin && (this.state.usersData[i].id != this.userid) ?
                    <View style={{ paddingTop: 15 }}>
                      <Menu
                        ref={(menu) => { this._menu[i] = menu }}
                        button={<Icons
                          name="more-vertical"
                          size={30}
                          onPress={() => this.showMenu(i)}
                        />}
                      >

                        <MenuItem onPress={() => {
                          this.hideMenu(i)
                          this.removeUser(this.state.usersData[i].id)
                        }}>Remove User from Group</MenuItem>
                        <MenuItem onPress={() => {
                          this.hideMenu(i)
                          this.makeAdmin(this.state.usersData[i].id)
                        }}>Make User Admin</MenuItem>
                      </Menu>
                    </View>
                    : null}
                </View>
              ))
            }
          </View>
        </Content>

        {this.state.isAdmin ?
          <Button onPress={() => {navigation.navigate("AddUsers", { selected:this.state.selected, users:this.state.users, 
            docRef: this.props.route.params.sub? 
            firebase.firestore().collection('Groups').doc(this.parentGroupKey) 
            : firebase.firestore().collection('Groups').doc('mainGroup'),
            sub:this.props.route.params.sub,
            group:this.group, parentGroupKey:this.parentGroupKey  }) }}
            title='Add Users'
            style={{ position: 'absolute', bottom: 0 }} />
          : null} 
        <Button onPress={() => { this.exitGroup() }}
          title='Exit Group'
          style={{ position: 'absolute', bottom: 0 }} />

        {this.props.route.params.sub && this.state.isAdmin ?
          <Button onPress={() => { this.deleteGroup() }}
            title='Delete Group'
            style={{ position: 'absolute', bottom: 0 }} />
          : null}
      </Container>
    );
  }
}
