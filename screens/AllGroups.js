import React, { Component } from 'react';
import { Alert, Text, Button } from 'react-native';
import { View, Thumbnail, ListItem, Left, Right, Body, Content, Container } from 'native-base';
import firebase from "../config/Firebase"


class AllGroups extends Component {

    constructor(props) {
        super(props)
        navigation = this.props.navigation
        this.userid = this.props.route.params.userid
        this.groupsRef = firebase.firestore().collection('Groups')
        this.state = {
            isAdmin: true,
            mainData: [],
        };
    }

    componentDidMount() {

        this.unsubscribe = this.groupsRef
            .onSnapshot((querySnapshot) => {
                this.setState({ mainData: [] })
                querySnapshot.forEach((doc) => {
                    this.setState({ mainData: [...this.state.mainData, doc.data()] })
                });
            });

        firebase.firestore().collection('Groups').doc('mainGroup').get().then(doc => {
            this.setState({ isAdmin: doc.data().admins.includes(this.userid) })
        })

    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    addUserToGroup(groupkey) {
        this.groupsRef.doc(groupkey).get().then(doc => {
            Alert.alert(
                'Join Group',
                `Are you sure you want to join ${doc.data().name}?`,
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            navigation.navigate('groupsList')
                            this.groupsRef.doc(groupkey).update({ users: firebase.firestore.FieldValue.arrayUnion(this.userid) })
                        }
                    },
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    }
                ],
                { cancelable: false }
            );
        })
    }

    render() {
        const RenderList = () => ((this.state.mainData).map((group) => {
            return (
                <View key={group.key}>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail source={{ uri: group.image_uri }} />
                        </Left>

                        <Body>
                            <Text>{group.name}</Text>
                            <Text></Text>
                        </Body>

                        <Right>
                            {group.users.includes(this.userid) ?
                                null
                                : <Button
                                    title='join'
                                    color='dimgrey'
                                    id={group.key}
                                    onPress={() => this.addUserToGroup(group.key)} 
                                />
                            }
                        </Right>
                    </ListItem>
                </View>
            )
        })
        )

        return (

            <Container>
                <Content noLeft >
                    <RenderList />
                </Content>
                {this.state.isAdmin ? <Button title='Add New Location Group'
                    onPress={() => this.props.navigation.navigate('AddNewLocGroup')}
                />
                    : null}
            </Container>
        )
    }
}

export default AllGroups