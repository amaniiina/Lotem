import React, { Component } from "react"
import { TouchableOpacity, Text, StyleSheet, Button, Alert } from "react-native"
import { View } from "native-base"
import firebase from "../config/Firebase";
import Icons from "react-native-vector-icons/Feather";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import { Thumbnail} from 'native-base'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// https://lh3.googleusercontent.com/kEm74bvpG9r2gt-LaG-zKBYJb_chHGAbieyX0sPHNMtpAloZgRO6fGO2tY1Hd1gm8PQ

class Profile extends Component {

    constructor(props) {
        super(props);
        this.Get_User_info();
        this.state = {
            isFetching: true,
            Username: "",
            Email: "",
            avatar: "",
            PhoneNumber: "",
            User_type: "",
            Location: "",
            loading: false,
            dp: ' https://lh3.googleusercontent.com/kEm74bvpG9r2gt-LaG-zKBYJb_chHGAbieyX0sPHNMtpAloZgRO6fGO2tY1Hd1gm8PQ',
        }
    }

    componentDidMount() {
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).get()
            .then(doc => {
                const user_info = {
                    Username: doc.data().Username,
                    Email: doc.data().Email,
                    Avatar: doc.data().Avatar,
                    PhoneNumber: doc.data().PhoneNumber,
                    User_type: doc.data().User_Type,
                    Location: doc.data().Location
                }
                this.setState(user_info);
            })
    }

    Get_User_info() {
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).get()
            .then(doc => {
                const user_info = {
                    Username: doc.data().Username,
                    Email: doc.data().Email,
                    avatar: doc.data().avatar,
                    PhoneNumber: doc.data().Phonenumber,
                    User_type: doc.data().User_type,
                    Location: doc.data().Location
                }
                this.setState(user_info, () => { console.log('avatar:', this.state.avatar) })
            })
    }

    Change_password(){
        firebase
        .auth()
        .sendPasswordResetEmail(this.state.Email)
        .then(
            ()=>alert("a password reset link was sent to the email: "+this.state.Email)
        ).catch(error=>alert(error));
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
            const imageRef = firebase.storage().ref(firebase.auth().currentUser.uid).child(uid)
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
                    obj['isFetching'] = false
                    this.setState(obj, () => {
                        //update avatar in firebase
                        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).update({
                            avatar: this.state.dp
                        })
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

    Delete_user(){
        Alert.alert(
            'Delete Account',
            `Are you sure you want to permanently delete your account?`,
            [
              {
                text: 'Yes',
                onPress: () => {
                    var user = firebase.auth().currentUser;
                    firebase.firestore().collection('Users').doc(user.uid).delete().then(
                    () => {
                        user.delete();
                        this.props.navigation.navigate('AuthStack', { screen: 'Home' });
                        }
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

    // update avatar in firebase
    _menu = null
    render() {
        const dpr = this.state.isFetching ? (<Thumbnail style={styles.thumb} source={{ uri: this.state.avatar }} />)
            : (<Thumbnail style={styles.thumb} source={{ uri: this.state.dp }} />)
        return (
            <View style={styles.background_style}>
                <View style={styles.top_view}>
                    {dpr}
                    <Text adjustsFontSizeToFit = {true}
                    style={styles.Username_Text_style}>{this.state.Username}</Text>
                    <Menu
                        ref={(menu) => { this._menu = menu }}
                        button={<Icons
                            style={{ alignSelf: 'flex-end'}}
                            name="more-vertical"
                            size={30}
                            onPress={() => this._menu.show()}
                        />}
                    >
                        <MenuItem onPress={() => {
                            this._menu.hide()
                            this.Change_password();
                        }}>Change Your Password</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={() => {
                            this._menu.hide()
                            this.props.navigation.navigate('changeInfo');
                        }}>update account information</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={() => {
                            this._menu.hide()
                            this.Delete_user()
                        }}>Delete your account</MenuItem>
                    </Menu>
                </View>
                <Button title='Change profile picture' onPress={() => {
                    this.openPicker()
                }} />
                <View style={styles.bottom_view}>
                    <View style={styles.data_view}>
                        <Text style={styles.bold_text}>
                            Email:<Text style={styles.normal_text}> {this.state.Email}</Text></Text>
                    </View>
                    <View style={styles.data_view}>
                        <Text style={styles.bold_text}>
                            Phone Number: <Text style={styles.normal_text}> {this.state.PhoneNumber}</Text></Text>
                    </View>
                    <View style={styles.data_view}>
                        <Text style={styles.bold_text}>
                            User Type: <Text style={styles.normal_text}> {this.state.User_type}</Text></Text>
                    </View>
                    <View style={styles.data_view}>
                        <Text style={styles.bold_text}>
                            Location: <Text style={styles.normal_text}> {this.state.Location}</Text></Text>
                    </View>
                </View>
                <View style={{ paddingBottom: 30 }}>
                    <TouchableOpacity style={styles.Sign_In_Button_Style}
                        onPress={
                            () => {
                                firebase.auth().signOut();
                                this.props.navigation.navigate('AuthStack',{ screen: 'Home' }); 
                            }
                        }
                    >
                        <Text style={styles.Sign_in_Text_style}>Sign out</Text>

                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}

export default Profile;

const styles = StyleSheet.create({

    background_style: {
        flex: 1, flexDirection: 'column', backgroundColor: 'white', paddingTop: 20
    },
    top_view: {
        width:'70%',
        alignItems: 'center', 
        flexDirection: 'row', 
        paddingLeft: 15, 
        paddingBottom: 20,
        textAlign: 'center'
    },
    bottom_view: {
        flex: 1, flexDirection: 'column', paddingTop: 15
    },
    image_style: {
        width: 90,
        height: 90,
        marginTop: 35,
        marginBottom: 10,
        opacity: 0.65,
    },
    data_view: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    bold_text: {
        fontSize: 20, fontWeight: 'bold', paddingVertical: 10, paddingHorizontal: 5
    },
    normal_text: {
        fontSize: 17, fontWeight: 'normal'
    },
    change: {
        paddingRight: 20, fontSize: 13, opacity: 0.5, textDecorationLine: 'underline'
    },
    Sign_In_Button_Style: {
        marginTop: 50,
        borderRadius: 50,
        backgroundColor: "#5d5d5d",
        borderColor: "#5d5d5d",
        color: 'white',
        borderWidth: 1,
        width: 150,
        height: 40,
        alignSelf: 'center',
    },
    Sign_in_Text_style: {
        textAlign: 'center',
        borderRadius: 50,
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 25,
        color: 'white',
        opacity: 1,
    },
    Username_Text_style: {
        borderRadius: 50,
        alignSelf: 'center',
        fontSize: 30,
        color: "#5d5d5d",
        fontWeight: 'bold',
        opacity: 0.85,
        paddingLeft: 20,
    }
})