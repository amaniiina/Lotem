import React, { Component } from "react";
import { TouchableOpacity, Text, TextInput, StyleSheet } from "react-native";
import { View } from "native-base";
import firebase from "../config/Firebase";
import RNPickerSelect from "react-native-picker-select";

firebase.firestore().settings({ experimentalForceLongPolling: true });

class Change_info extends Component {
    constructor(props) {
        super(props);

        this.usersRef = firebase.firestore().collection('Users');
        this.state = {
            Email: "",
            Username: "",
            PhoneNumber: "",
            Location: "",
            EmailorPhone: false,
            User_Type: true,
            Location_list: [],
        }
        this.items = [];
        this.Get_User_info();
    }

    componentDidMount() {
        firebase.firestore().collection('Groups').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if (doc.data().key !== 'journalists' && doc.data().key !== 'resources' &&
                    doc.data().key !== 'donations' && doc.data().key !== 'relations' 
                    && doc.data().key !== 'mainGroup' ) {
                    this.items.push({
                        label: doc.data().name, value: doc.data().key
                    });
                }
            })
            this.setState({ Location_list: this.items });
        })
    }

    Get_User_info() {
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).get()
            .then(doc => {
                var bool = false;
                if (doc.data().User_Type === 'Activist') {
                    bool = true;
                }
                const user_info = {
                    Email: doc.data().Email,
                    Username: doc.data().Username,
                    Avatar: doc.data().Avatar,
                    PhoneNumber: doc.data().PhoneNumber,
                    User_type: bool,
                    Location: doc.data().Location
                }
                this.setState(user_info);
            })
    }


    Input_check() {
        if (this.state.PhoneNumber.length === 0 || this.state.Username.length === 0 || this.state.Location.length === 0) {
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
        return true;
    }

    Update_to_firebase() {
        var user_info = {
            Username: this.state.Username,
            PhoneNumber: this.state.PhoneNumber,
            Location: this.state.Location,
            User_Type: this.state.User_Type ? 'Activist' : 'Journalist',
        }

        this.usersRef.doc(firebase.auth().currentUser.uid).update(user_info)

    }

    Apply_changes() {
        if (this.Input_check()) {
            firebase.auth().currentUser.updateProfile({
                displayName: this.state.Username,
            })
            this.Update_to_firebase();
            this.props.navigation.pop('Profile');
            this.props.navigation.push('Profile');
        }
    }

    render() {
        return (
            <View style={styles.background_style}>

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

                <RNPickerSelect
                    style={Pick_style}
                    useNativeAndroidPickerStyle={false}
                    value={this.state.Location}
                    placeholder={{ label: "Location", value:null }}
                    onValueChange={Location => {
                        if(Location === null){
                            alert('Please select a city')
                        }else{
                        this.setState({ Location })
                        }
                    }}
                    items={this.state.Location_list}
                ></RNPickerSelect>

                <View style={this.state.User_Type ? styles.User_type_Activist : styles.User_type_Journalist}>
                    <TouchableOpacity onPress={User_Type => this.state.User_Type ? this.setState({ User_Type: false }) : this.setState({ User_Type: true })}>
                        <Text style={this.state.User_Type ? styles.User_Type_text_Activist : styles.User_Type_text_Journalist} >
                            {this.state.User_Type ? 'Activist' : 'Journalist'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.Sign_Up_Button_Style}>
                    <TouchableOpacity
                        onPress={
                            Next => {
                                this.Apply_changes();
                            }
                        }
                    >
                        <Text style={styles.Sign_Up_Text_style}>Apply</Text>

                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default Change_info;


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
    },

}
const styles = StyleSheet.create({
    User_type_Activist: {
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
    User_type_Journalist: {
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
    User_Type_text_Activist: {
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 20,
        color: "#5d5d5d",
        fontFamily: 'Malgun Gothic',
        fontWeight: 'bold',
        opacity: 0.85
    },
    User_Type_text_Journalist: {
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