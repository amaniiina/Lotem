import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { View } from "native-base";
import firebase from "../../config/Firebase";

class Verify extends Component {

    Verify_Email() {
        var curr_user = firebase.auth().currentUser;

        curr_user.sendEmailVerification().catch(error => alert(error));

    }
    constructor(props) {
        super(props);
        this.Verify_Email();

    }

    resend_email() {
        var curr_user = firebase.auth().currentUser;
        curr_user.sendEmailVerification().catch(error => alert(error));
    }

    render() {
        return (

            <View style={styles.background_style}>
                <View>
                    <Text style={styles.Step_text}>
                        Just one last step{'\n\n'}
                        Check your Email for verification Link{'\n\n'}
                        only after verifing your email you
                        are able to login to your account
                    </Text>
                </View>

                <View>
                    <Text style={styles.Step_text}>
                        {'\n'}{'\n'}{'\n'}{'\n'}   Did not receive Email ? {'\n'}{'\n'}Check you email for mistakes{'\n'}or
                    </Text>
                    <TouchableOpacity onPress={() => this.resend_email()}>
                        <Text style={styles.Step_text_click}>Click here to resend Email</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.Sign_In_Button_Style}>
                    <TouchableOpacity >
                        <Text onPress={() => {
                            firebase.auth().currentUser.
                                reload().
                                then(() => {
                                    console.log('verfied');
                                    var user = firebase.auth().currentUser.emailVerified;
                                    if (user) {
                                        this.props.navigation.navigate('Info')
                                    } else {
                                        alert("Email not verifed yet");
                                    }
                                })
                        }}
                            style={styles.Sign_in_Text_style}>Verify</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default Verify;


const styles = StyleSheet.create({
    Verify_Style: {
        flex: 0.5,
        height: 20,
        width: '99%',
        flexDirection: 'row',
        marginBottom: 1,
        alignContent: 'center',
        alignSelf: 'center',
        borderColor: '#000000',
        borderWidth: 0

    },
    Input_Style: {
        borderColor: "#000000",
        borderWidth: 2,
        borderRadius: 15,
        width: 60,
        height: 60,
        alignSelf: 'center',
        alignContent: "center",
        textAlign: "center",
        marginLeft: 4,
        marginRight: 4
    },
    background_style: {
        height: '100%',
        width: '100%',
        backgroundColor: "#f6f6f6"
    },
    Sign_In_Button_Style: {
        marginTop: 70,
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
    Step_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 25,
        color: "#5d5d5d",
        fontFamily: 'Malgun Gothic',
        fontWeight: 'bold',
        opacity: 0.85
    },
    Step_text_click: {
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 25,
        color: "#5d5d5d",
        fontFamily: 'Malgun Gothic',
        fontWeight: 'bold',
        opacity: 0.85,
        textDecorationLine: 'underline'
    },
})