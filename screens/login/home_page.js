import React,{Component} from "react"
import {TouchableOpacity,Text,Image,StyleSheet} from "react-native"
import {View} from "native-base"

class Home extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <View>
                    <Image style = {sty.Logo_style} source={ require("./img/lotemicon.png")}></Image>
                    
                    <View style = {sty.Sign_In_Button_Style}>
                        <TouchableOpacity onPress = {() => 
                            {
                            this.props.navigation.navigate('Login');
                            }
                            }>
                            <Text style = {sty.Sign_in_Text_style}>Sign in</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style = {sty.Dont_have_account}>
                            Don't have an account?
                        </Text>
                    </View>
                    
                    <View>
                        <TouchableOpacity onPress = {() =>{
                            this.props.navigation.navigate('Signup',this.state);
                        }}>
                            <Text style = {sty.Sign_Up_style}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
             
            </View>
        )
    }
}

export default Home;


sty =StyleSheet.create({
    background_style:{
        height:'100%',
        width:'100%',
        backgroundColor : "#f6f6f6"
    },
    Logo_style:{
        width:300,
        height:300,
        marginTop:35,
        alignSelf:'center',
        opacity:0.65
    },
    Sign_In_Button_Style:{
        marginTop:50,
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
    Dont_have_account:{
        fontSize:20,
        paddingTop:15,
        color:'#5d5d5d',
        fontFamily:'Malgun Gothic',
        alignSelf:'center'
    },
    Sign_Up_style:{
        fontSize:30,
        paddingTop:5,
        color:'#5d5d5d',
        fontFamily:'Malgun Gothic',
        alignSelf:'center',
        fontWeight:'bold',
        textDecorationLine: 'underline'
    }
})