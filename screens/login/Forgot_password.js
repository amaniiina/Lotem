import React,{Component} from "react";
import {TouchableOpacity,Text,TextInput,Image,StyleSheet} from "react-native";
import {View} from "native-base";
import firebase from "../../config/Firebase";
import {HideWithKeyboard,ShowWithKeyboard } from 'react-native-hide-with-keyboard';

class Forgot extends Component{
    constructor(props){
        super(props);
        this.state = {
          Email:"",
        }
        
    }
    Reset_Password(){
        firebase
        .auth()
        .sendPasswordResetEmail(this.state.Email).then(
            ()=>alert("email was sent successfully")
        ).catch(error=>alert(error));
    }
    render(){
        return(
            
            <View style = {styles.background_style}>

                <ShowWithKeyboard>
                    <View style = {{marginTop:50}}></View>
                </ShowWithKeyboard>

                <HideWithKeyboard>
                    <Image style = {styles.image_style} source={ require("./img/lotemicon.png")}></Image>
                </HideWithKeyboard>

                <View>
                    <View style = {styles.Input_Style}>
                        <TextInput
                            placeholder = {"Email"}
                            onChangeText = {Email => this.setState({Email})}
                            value = {this.state.Email}
                            keyboardType = {'email-address'}
                            
                        >
                        </TextInput>
                    </View>
                </View>

                <View >
                    <Text style = {styles.Forget_pass}>
                        Enter your email and we'll send {'\n'}you a Reset password link  
                    </Text>
                </View>

                <View style = {styles.Sign_In_Button_Style}>
                        <TouchableOpacity 
                            onPress = { () => this.Reset_Password()}
                        >
                            <Text style = {styles.Sign_in_Text_style}>Reset</Text>
                        </TouchableOpacity>
                </View>
               
            </View>
            
       )
    }
}

export default Forgot;

const styles =StyleSheet.create( {
        Input_Style:{
            position:"relative",
            borderColor:"#000000",
            borderWidth:2,
            borderRadius:50,
            width:300,
            height:55,
            alignSelf:'center',
            marginBottom:35,
            alignContent: "center",
            paddingLeft:20,
        },
        background_style:{
            height:'100%',
            width:'100%',
            backgroundColor : "#f6f6f6"
        },
        image_style:{
            width:300,
            height:300,
            marginTop:20,
            alignSelf:'center',
            opacity:0.65,
    
        },
        Circle_Style:{
            height:60,
            width:60,
            borderColor:'#000000',
            borderWidth:2,
            borderRadius:50
        },
        Sign_In_Button_Style:{
            position:"relative",
            bottom:30,
            marginTop:30,
            borderRadius:50,
            backgroundColor:"#ffffff",
            borderColor:"#5d5d5d",
            borderWidth:1,
            width:290,
            height:75,
            alignSelf:'center'
        },
        Sign_in_Text_style:{
            textAlign:'center',
            borderRadius:50,
            textAlignVertical:'center',
            alignSelf:'center',
            fontSize:50,
            color:"#5d5d5d",
            fontFamily:'Malgun Gothic',
            fontWeight:'bold',
            opacity:0.85
        },
        Swich_Style:{
            position:"relative",
            marginBottom:20,
            marginTop:10,
            marginLeft:280,
            height:30,
            width:150,
            flex:0.35,
            flexDirection:'row'
        },
        phone_Icon_Style:{
            height:25,
            width:25,
            borderColor:'#000000',
        },
        email_Icon_Style:{
            height:25,
            width:25,
            borderColor:'#000000',
            marginBottom:10,
            marginRight:5,
        },
        Forget_pass:{
            position:"relative",
            alignSelf:'center',
            marginBottom:30,
            fontSize:22,
            fontFamily:'Malgun Gothic',
            fontWeight:'bold',
            textAlign:'center',
            color:'#5d5d5d'
            
            
        }
})