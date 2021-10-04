import React from 'react'
import { Actions, Send } from 'react-native-gifted-chat';
import Icons from "react-native-vector-icons/Feather"
import ImagePicker from 'react-native-image-crop-picker';
import firebase from "../config/Firebase"
import RNFetchBlob from 'react-native-fetch-blob';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}
  >
    <Icons name='send' size={30} />
  </Send>
)

export const renderActions = (props) => (
  <Actions
    {...props}

    icon={() => (
      <Icons name='paperclip' size={30} />
    )}
    options={{
      'Gallery': () => {
         openPicker(props)
      }
      // ,
      // 'Document': () => {
      //   console.log('Choose From Library');
      // },
    }}
    optionTintColor="#222B45"
  />
);

function openPicker(props) {

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
    mediaType: 'photo',
    cropping: true,
  }).then(image => {

    const imagePath = image.path
    let uploadBlob = null
    //reference to firebase storage 
    const imageRef = firebase.storage().ref(props.groupKey).child(uid)
    
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
          let currDate = firebase.firestore.Timestamp.fromDate(new Date())
          props.messagesRef.add({
                  _id:uid,
                  text:'',
                  createdAt: currDate,
                  user: {
                      _id: props.userid,
                      name: props.username,
                      avatar: props.avatar
                  },
                  image:url,
              })

      })
      .catch((error) => {
        console.log(error)
      })
  })
    .catch((error) => {
      console.log(error)
    })
}