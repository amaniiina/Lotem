import React, { Component } from 'react'
import { View, Text, Image, Alert } from 'react-native'
import SelectMultiple from 'react-native-select-multiple'
import firebase from '../config/Firebase'

// const fruits = ['Apples', 'Oranges', 'Pears']

// --- OR ---
// const fruits = [
//     { label: 'Apples', value: 'appls' },
//     { label: 'Oranges', value: 'orngs' },
//     { label: 'Pears', value: 'pears' }
// ]

class ChooseUsersList extends Component {
    constructor(props) {
        super(props)
        this.dataArr = props.users
        this.selectedSend = props.selected
        this.state = { selected: [], usernames: [], count: 0 }
    }

    renderLabel = (label, style) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ width: 42, height: 42 }} source={{ uri: label.value }} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={style}>{label.username}</Text>
                </View>
            </View>
        )
    }

    componentDidMount() {
        if (this.dataArr.length === 0) {
            Alert.alert('no available users')
        } else {
            const temp = Array.from(this.dataArr)
            firebase.firestore().collection('Users').get()
                .then(querySnapshot => {
                    querySnapshot.forEach(user => {
                        let index = temp.indexOf(user.data().Uid)
                        if (index !== -1) {
                            this.setState(prevState => {
                                const a = { label: { username: user.data().Username, value: user.data().avatar, id: user.data().Uid }, value: user.data().Username }
                                // const usersAvatars = [...prevState.usersAvatars, user.data().avatar]
                                const usernames = [...prevState.usernames, a]
                                return { usernames }

                            })
                        }
                    })
                })
        }
    }

    onSelectionsChange = (selected) => {
        // selected is array of { label, value }
        this.setState({ selected, count: selected.length })
        // this.selectedSend= Array.from(selected.label)
        this.selectedSend.splice(0, this.selectedSend.length)
        selected.forEach(element => {
            this.selectedSend.push(element.label.id)
        })
        // console.log('selectedsend in usersList', this.selectedSend)
    }

    render() {

        return (

            <View>
                <Text style={{ margin: 20, fontSize: 20 }}>Users Selected:{this.state.count}</Text>
                <SelectMultiple
                    items={this.state.usernames}
                    renderLabel={this.renderLabel}
                    selectedItems={this.state.selected}
                    onSelectionsChange={this.onSelectionsChange}
                />

            </View>
        )
    }
}

export default ChooseUsersList
