import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text, TextInput, Image } from "react-native";
import { View } from "native-base";
import firebase from "../../config/Firebase";
import RNPickerSelect from "react-native-picker-select";

firebase.firestore().settings({ experimentalForceLongPolling: true });


class SignUp extends Component {
    constructor(props) {
        super(props);

        firebase.firestore.setLogLevel('debug');
        this.usersRef = firebase.firestore().collection('Users');
        this.state = {
            Uid: '',
            Username: "",
            Email: "",
            Password: "",
            PhoneNumber: "",
            EmailorPhone: false,
            User_Type: true, //true=activist
            Location: '', // changed
    
            Location_list: [],
        }
        this.items = [];
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

    Input_check() {
        if (this.state.Email.length === 0 || this.state.PhoneNumber.length === 0 || this.state.Username.length === 0 || this.state.Password.length === 0 || this.state.confirmPassword.length === 0 || this.state.Location.length === 0) {
            alert("please fill all the fields");
            return false;
        }
        if (this.state.PhoneNumber.length < 10 || this.state.PhoneNumber[0] !== '0' || this.state.PhoneNumber[1] !== '5') {
            alert("please enter a valid phone number");
            return false;
        }
        if (this.state.Username.length < 4) {
            alert("The User name must be at least 4 characters long");
            return false;
        }
        if (this.state.Password !== this.state.confirmPassword) {
            alert("The password dose not match");
            return false;
        }
        if (this.state.Password.length < 6) {
            alert("The password is to short 6 characters min");
            return false;
        }
        return true;
    }
    AddUser_ToFirestore(res) {
        this.setState({ Uid: firebase.auth().currentUser.uid })
        var user_info = {
            Uid: firebase.auth().currentUser.uid,
            avatar: '',
            Email: this.state.Email,
            Username: this.state.Username,
            PhoneNumber: this.state.PhoneNumber,
            Location: this.state.Location,
            User_Type: this.state.User_Type ? 'Activist' : 'Journalist',
        }

        setTimeout(() => {
            this.usersRef.doc(firebase.auth().currentUser.uid).set(user_info)
                .then(() => {
                    this.AddToGroups()
                })
        }, 10)


    }

    AddToGroups() {
        //activist add to main and location
        if (this.state.User_Type) {
            firebase.firestore().collection('Groups').doc('mainGroup')
                .update({ users: firebase.firestore.FieldValue.arrayUnion(this.state.Uid) })
            firebase.firestore().collection('Groups').doc(this.state.Location)
                .update({ users: firebase.firestore.FieldValue.arrayUnion(this.state.Uid) })
        } else { //journalist add to journalists' group
            firebase.firestore().collection(Groups).doc('journalists')
                .update({ users: firebase.firestore.FieldValue.arrayUnion(this.state.Uid) })
        }
    }

    Sign_Up_submit() {
        if (this.Input_check()) {
            firebase.
                auth().
                createUserWithEmailAndPassword(this.state.Email, this.state.Password).
                then((res) => {
                    firebase.auth().currentUser.updateProfile({
                        displayName: this.state.Username,
                    }).then(() => {
                        this.AddUser_ToFirestore()
                        this.props.navigation.navigate('Verify')
                    })
                })
                .catch(error => alert(error))
        }
    }

    render() {
        return (

            <View style={styles.background_style}>

                <View style={styles.Input_Style}>
                    <TextInput
                        placeholder={"Email"}
                        onChangeText={Email => this.setState({ Email })}
                        value={this.state.Email}
                        keyboardType={'email-address'}
                    />
                </View>

                <View style={styles.Input_Style}>
                    <TextInput
                        placeholder={"Phone Number"}
                        onChangeText={PhoneNumber => this.setState({ PhoneNumber })}
                        value={this.state.PhoneNumber}
                        keyboardType={"numeric"}
                        maxLength={10}
                    />
                </View>

                <View style={styles.Input_Style}>
                    <TextInput
                        placeholder={"User Name"}
                        onChangeText={Username => this.setState({ Username })}
                        value={this.state.Username}
                        keyboardType={'default'}
                    />
                </View>

                <View style={styles.Input_Style}>
                    <TextInput
                        placeholder={"Password"}
                        onChangeText={Password => this.setState({ Password })}
                        value={this.state.Password}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.Input_Style}>
                    <TextInput
                        placeholder={"Confirm password"}
                        onChangeText={confirmPassword => this.setState({ confirmPassword })}
                        value={this.state.confirmPassword}
                        secureTextEntry={true}
                    />
                </View>


                <RNPickerSelect
                    style={Pick_style}
                    useNativeAndroidPickerStyle={false}
                    value={this.state.Location}
                    placeholder={{ label: "Select a Location", value: null }}
                    onValueChange={Location => {
                        console.log('loc in sign up:', Location)
                        if(Location === null){
                            alert('Please select a city')
                        }else{
                        this.setState({ Location })
                        }
                    }}
                    items={this.state.Location_list}
                ></RNPickerSelect>

                <View style={this.state.User_Type ? styles.User_type_activest : styles.User_type_jurnalist}>
                    <TouchableOpacity onPress={User_Type => this.state.User_Type ? this.setState({ User_Type: false }) : this.setState({ User_Type: true })}>
                        <Text style={this.state.User_Type ? styles.User_Type_text_activest : styles.User_Type_text_jurnalist} >
                            {this.state.User_Type ? 'Activist' : 'Journalist'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ textAlign: 'center' }}>
                    If you are a journalist please press on the button above
                </Text>

                <View style={styles.Sign_Up_Button_Style}>
                    <TouchableOpacity
                        onPress={Next => {
                                this.Sign_Up_submit();
                            }}
                    >
                        <Text style={styles.Sign_Up_Text_style}>Next</Text>

                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default SignUp;


const Pick_style = {
    inputIOS: {
        borderColor: "#000000",
        borderWidth: 2,
        borderRadius: 50,
        width: 300,
        height: 50,
        alignSelf: 'center',
        marginBottom: 15,
        alignContent: "center",
        paddingLeft: 20,
    },
    inputAndroid: {
        borderColor: "#000000",
        borderWidth: 2,
        borderRadius: 50,
        width: 300,
        height: 50,
        alignSelf: 'center',
        marginBottom: 15,
        alignContent: "center",
        paddingLeft: 20,
    }
}
const styles = StyleSheet.create({
    User_type_activest: {
        borderColor: "#000000",
        backgroundColor: "#f6f6f6",
        borderWidth: 2,
        borderRadius: 50,
        width: 300,
        height: 30,
        alignSelf: 'center',
        marginTop: 15,
        textAlign: 'center',
    },
    User_type_jurnalist: {
        borderColor: "#000000",
        backgroundColor: "#5d5d5d",
        borderWidth: 2,
        borderRadius: 50,
        width: 300,
        height: 30,
        alignSelf: 'center',
        marginTop: 15,
        textAlign: 'center',
    },
    User_Type_text_activest: {
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 20,
        color: "#5d5d5d",
        fontFamily: 'Malgun Gothic',
        fontWeight: 'bold',
        opacity: 0.85
    },
    User_Type_text_jurnalist: {
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 20,
        color: "#ffffff",
        fontFamily: 'Malgun Gothic',
        fontWeight: 'bold',
        opacity: 0.85
    },
    Input_Style: {
        borderColor: "#000000",
        borderWidth: 2,
        borderRadius: 50,
        width: 300,
        height: 50,
        alignSelf: 'center',

        marginBottom: 15,
        alignContent: "center",
        paddingLeft: 20,

    },
    background_style: {
        height: '100%',
        width: '100%',
        backgroundColor: "#f6f6f6",
        paddingTop: 20
    },
    Sign_Up_Button_Style: {
        marginTop: 50,
        borderRadius: 50,
        backgroundColor: "#ffffff",
        borderColor: "#5d5d5d",
        borderWidth: 1,
        width: 290,
        height: 75,
        alignSelf: 'center'
    },
    Sign_Up_Text_style: {
        textAlign: 'center',
        borderRadius: 50,
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 50,
        color: "#5d5d5d",
        fontFamily: 'Malgun Gothic',
        fontWeight: 'bold',
        opacity: 0.85
    },
    Swich_Style: {
        marginBottom: 10,
        marginTop: 10,
        height: 30,
        width: 150,
        alignSelf: 'center',
        borderColor: "#000000",
        flex: 0.2,
        flexDirection: 'row'
    },
    phone_Icon_Style: {
        height: 40,
        width: 40,
        borderColor: '#000000',
    },
    email_Icon_Style: {
        height: 40,
        width: 40,
        borderColor: '#000000',
        marginBottom: 10,
        marginRight: 5
    },
    Switch_pos: {
        alignSelf: 'center',
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 10,
    },
})