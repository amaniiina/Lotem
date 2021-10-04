import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Switch, Text, TextInput, Image } from "react-native";
import { View } from "native-base";
import firebase from "../../config/Firebase";
import { HideWithKeyboard, ShowWithKeyboard } from 'react-native-hide-with-keyboard';

firebase.firestore().settings({ experimentalForceLongPolling: true });

class LogIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: "",
            Password: "",
            PhoneNumber: "",
        }

    }
    componentDidMount() {
        let user = firebase.auth().currentUser
        if (user) {
            if (user.emailVerified) {
                this.props.navigation.navigate('TabStack');
            }
        }
    }
    Login_user() {
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.Email, this.state.Password)
            .then(res => {
                if (firebase.auth().currentUser.emailVerified) {
                    this.props.navigation.navigate('TabStack');
                } else {
                    firebase.auth().signOut();
                    alert("please verify your email before trying to login")
                    firebase.auth().currentUser.sendEmailVerification()
                }
            })
            .catch(error => alert(error));
    }
    render() {
        return (

            <View style={styles.background_style}>

                <ShowWithKeyboard>
                    <View style={{ marginTop: 50 }}></View>
                </ShowWithKeyboard>

                <HideWithKeyboard>
                    <Image style={styles.image_style} source={require("./img/lotemicon.png")}></Image>
                </HideWithKeyboard>

                <View>
                    <View style={styles.Input_Style}>
                        <TextInput
                            placeholder={"Email"}
                            onChangeText={Email => this.setState({ Email })}
                            value={this.state.Email}
                            keyboardType={'email-address'}
                        >
                        </TextInput>
                    </View>
                    <View style={styles.Input_Style}>
                        <TextInput
                            placeholder={"Password"}
                            onChangeText={Password => this.setState({ Password })}
                            value={this.state.Password}
                            secureTextEntry={true}
                        >
                        </TextInput>
                    </View>
                </View>

                <View style={styles.Forget_pass}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Forgot')}>
                        <Text>Forgot password ?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.Sign_In_Button_Style}>
                    <TouchableOpacity
                        onPress={() => this.Login_user()}
                    >
                        <Text style={styles.Sign_in_Text_style}>Sign in</Text>
                    </TouchableOpacity>
                </View>

            </View>

        )
    }
}

export default LogIn;

const styles = StyleSheet.create({
    Input_Style: {
        position: "relative",
        borderColor: "#000000",
        borderWidth: 2,
        borderRadius: 50,
        width: 300,
        height: 55,
        alignSelf: 'center',
        marginBottom: 15,
        alignContent: "center",
        paddingLeft: 20,
    },
    background_style: {
        height: '100%',
        width: '100%',
        backgroundColor: "#f6f6f6"
    },
    image_style: {
        width: 300,
        height: 300,
        marginTop: 20,
        alignSelf: 'center',
        opacity: 0.65,

    },
    Circle_Style: {
        height: 60,
        width: 60,
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 50
    },
    Sign_In_Button_Style: {
        position: "relative",
        bottom: 30,
        marginTop: 30,
        borderRadius: 50,
        backgroundColor: "#ffffff",
        borderColor: "#5d5d5d",
        borderWidth: 1,
        width: 290,
        height: 75,
        alignSelf: 'center'
    },
    Sign_in_Text_style: {
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
        position: "relative",
        marginBottom: 20,
        marginTop: 10,
        marginLeft: 280,
        height: 30,
        width: 150,
        flex: 0.35,
        flexDirection: 'row'
    },
    phone_Icon_Style: {
        height: 25,
        width: 25,
        borderColor: '#000000',
    },
    email_Icon_Style: {
        height: 25,
        width: 25,
        borderColor: '#000000',
        marginBottom: 10,
        marginRight: 5,
    },
    Switch_pos: {
        alignSelf: 'center',
        marginRight: 5,
    },
    Forget_pass: {
        position: "relative",
        alignSelf: 'center',
        left: 90,
        marginBottom: 10,
        textDecorationLine: 'underline',
    }
})