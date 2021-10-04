import React, { Component } from "react"
import { Text, Image, StyleSheet } from "react-native"
import { View, Button } from "native-base"
import Icons from "react-native-vector-icons/MaterialCommunityIcons";

class inf extends Component {
    constructor(props) {
        super(props)
        navigation = this.props.navigation

    }

    render() {

        return (
            <View style={styles.background_style}>

                <Image style={styles.Logo_style} source={require("./img/lotemicon.png")}></Image>

                <View style={styles.who}>
                <Image style={styles.whoim} source={require("./img/WhoWeAre.jpeg")}></Image>
                    <Text adjustsFontSizeToFit={true} style={styles.Body_Text_style} >
                        {'\n'}
                            Lotem: A Gender Counter-terrorism Unitunites
                            feminist women across the country who are interested
                            in feminist activism against sexual and gender violence.
                        </Text>
                </View>
                <Text style={styles.Title_Text_style}>
                    {'\n'} Our Goal:
                        </Text>

                <Text adjustsFontSizeToFit={true} style={styles.Body_Text_style} >
                    Lotem's primary goal is to be an effective feminist
                    organizing platform for non-violent direct actions
                    (NVDA), with the aim of raising issues of sexual violence,
                    gender violence and the inclusion of women on the agenda, to
                    attract media and public attention, and to channel
                    public pressure on elected officials and decision-making positions.
                        </Text>

                <View style={styles.iconsView}>

                    <View style={styles.icons}>
                        <Text>Go to your profile </Text>
                        <Icons name={'face'} size={50} />
                    </View>

                    <View style={styles.icons}>
                        <Text>Chat and be active</Text>
                        <Icons name={'account-group-outline'} size={50} />
                    </View>

                    <View style={styles.icons}>
                        <Text style={styles.texts}>Don't miss the events</Text>
                        <Icons name={'calendar-month'} size={50} />
                    </View>

                    <View style={styles.icons}>
                        <Text style={styles.texts}>In case of emergency</Text>
                        <Icons name={'alarm-light-outline'} size={50} />
                    </View>

                </View>
                <Button
                    style={styles.btn}
                    onPress={() => navigation.navigate("TabStack")} ><Text style={styles.btnTxt}>Take me to the next page :)</Text></Button>

            </View>
        )
    }
}



styles = StyleSheet.create({
    background_style: {
        flex:1,
        backgroundColor: "#f6f6f6"
    },
    Logo_style: {
        width: 220,
        height: 250,
        alignSelf: 'center',
        flex: 1,
        margin:10
    },
    Title_Text_style: {
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 25,
        color: "#5d5d5d",
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
        opacity: 0.85
    },
    Body_Text_style: {
        width: '86%',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 15,
        color: "#5d5d5d",
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
        opacity: 0.85,
        flex:1
    },
    icons: {
        flexDirection: 'column',
        margin: '4%',
        width: 70,
        alignSelf: 'center'
    },
    iconsView: {
        flexDirection: 'row',

    },
    btn: {
        backgroundColor: '#f6f6f6',
        borderColor: 'black',
        borderWidth: 1,
        width: '100%',
        justifyContent: 'center',


    },
    btnTxt: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    who: {
        flexDirection: 'row',
        flex:1,
    },
    whoim: {
        height:140,
        width:80,
        flex:1,
        margin:10
    },
    gen:{
        height:50,
        width:50,
    }


});


export default inf;




