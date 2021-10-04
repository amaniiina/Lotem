import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    txt: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#AF9488'
    },
    subs: {
        paddingLeft: 30
    },
    showSubsButton: {
        padding: 21
    },
    input: {
        flex: 1,
        marginLeft: 10,
        height: 40,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: 'skyblue',
        alignContent: 'center',
        textAlign: 'center'
    },
    changeBtn: {
        margin: 10,
        flex: 0.3
    },
    thumb: { 
        width: 90, 
        height: 90, 
        borderColor: 'skyblue', 
        borderWidth: 2, 
        borderRadius: 100 
    },
    txt: {
        margin: 5,
        textAlign: "center",
        width: 250
    }
})