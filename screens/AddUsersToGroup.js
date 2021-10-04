import React, { Component } from 'react';
import { Button } from 'react-native'
import Users from './ChooseUsersList'
import { Container, Content } from 'native-base';
import firebase from "../config/Firebase"

class AddUsersToGroup extends Component {
    constructor(props) {

        super(props)
        this.docRef = this.props.route.params.docRef
        this.usersInGroup = this.props.route.params.users
        if (this.props.route.params.sub === true) {
            this.groupRef = firebase.firestore().collection('Groups').doc(this.props.route.params.parentGroupKey)
                .collection('subGroups').doc(this.props.route.params.group.key)
        } else {
            this.groupRef = firebase.firestore().collection('Groups').doc(this.props.route.params.group.key)
        }

        this.state = {
            selected: this.props.route.params.selected,
            users: [],
            isFetching: true
        }

    }

    componentDidMount() {
        if (this.props.route.params.sub) {
            this.docRef.get().then(doc => {
                const a = doc.data().users
                // return users not already in this group
                this.setState({ users: a.filter(x => !this.usersInGroup.includes(x)), isFetching: false })
            })
        } else {
            firebase.firestore().collection('Users').get().then(querySnapshot => {
                let a = []
                querySnapshot.forEach(doc => {
                    if (doc.data().type !== 'Journalist')
                        a.push(doc.data().Uid)
                })
                this.setState({ users: a.filter(x => !this.usersInGroup.includes(x)), isFetching: false })
            })
        }

    }

    addUsers() {
        // console.log(this.state.selected)
        this.state.selected.forEach(element => {
            this.groupRef.update(
                'users', firebase.firestore.FieldValue.arrayUnion(element)
            )
        })
        navigation.navigate('chatApp')
    }

    render() {
        return (
            <Container>
                <Content>
                    {this.state.isFetching ? null : <Users users={this.state.users} selected={this.state.selected} />}
                </Content>
                <Button onPress={() => { this.addUsers() }}
                    title='Add'
                    style={{ position: 'absolute', bottom: 0 }} />
            </Container>
        )
    }
}
export default AddUsersToGroup