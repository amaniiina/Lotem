import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import { View, Thumbnail, ListItem, Left, Body, Content, Container } from 'native-base';
import Icons from "react-native-vector-icons/Feather";
import styles from '../styles/styles';
import firebase from "../config/Firebase"


class Groups extends Component {

  constructor(props) {
    super(props)
    this.getSubGroups.bind(this)
    navigation = this.props.navigation
    this.userid = firebase.auth().currentUser.uid
    this.groupsRef = firebase.firestore().collection('Groups')
    this.state = {
      currGroupIndex: 0,                                                 //🤦‍♀️🤦‍♀️🤦‍♀️🤦‍♀️🤦‍
      mainData: [],
      subData: {},
    };
  }

  getSubGroups(groupKey, groupUsers, clicked) {
    //get subgroups of specified group
    firebase.firestore().collection('Groups').doc(groupKey).collection('subGroups')
      .orderBy('createdAt', 'desc')
      .get()
      .then(querySnapshot => {
        const subData = Object.assign({}, this.state.subData);
        querySnapshot.forEach(subDoc => {
          if ((subDoc.data().users).includes(this.userid)) {
            subData[groupKey] = (subData[groupKey] || []).concat([subDoc.data()]);
          } 
        });
        this.setState({ subData })
      })
  }

  componentDidMount() {

    this.unsubscribe = this.groupsRef
      .orderBy('createdAt')
      .onSnapshot((querySnapshot) => {
        this.setState({ mainData: [] })
        querySnapshot.forEach((doc) => {
          doc.data().users.forEach(userId => {
            if (userId === this.userid) {
              this.setState({ mainData: [...this.state.mainData, doc.data()] })
            }
          })
        });
      });

    //get all groups
    this.groupsRef
      .orderBy('createdAt')
      .get()
      .then(querySnapshot => {
        if (this.state.mainData.length < 1) {
          querySnapshot.forEach(doc => {
            doc.data().users.forEach(userId => {
              if (userId === this.userid) {
                this.setState({ mainData: [...this.state.mainData, doc.data()] })
              }
            })
          });
        }
      });

  }

  handleClick(group) {
    let temp = [...this.state.mainData];
    let index = temp.findIndex(el => el.key == group.key);
    let flag = temp[index].clicked
    temp[index] = { ...temp[index], clicked: !flag };
    this.state.subData[group.key] = undefined;
    this.setState({ mainData: temp, currGroupIndex: index }, () => {
      this.getSubGroups(group.key, group.users, !flag) //changed
    });
  }

  render() {

    const RenderSubList = (props) => {
      // alert(Object.keys(this.state.subData[props.groupKey]).length)
      // if(this.state.subData[props.groupKey]== null || this.state.subData[props.groupKey]=== undefined ){
      //   console.log('no subs')
      //   return (
      //   <View><Text>You aren't in any of this groups' subgroups</Text></View>  
      //   )
      // }else{
      return ((this.state.subData[props.groupKey]).map((subGroup, i) => {
        return (
          <View key={i} style={styles.subs}>
            <ListItem avatar onPress={() => navigation.navigate("chatScreen",
              {
                parentGroupKey: props.groupKey,
                group: subGroup,
                userid: this.userid,
                sub: true
              })}>
              <Left>
                <Thumbnail source={{ uri: subGroup.image_uri }} />
              </Left>

              <Body>
                <Text>{subGroup.name}</Text>
                <Text note numberOfLines={1}>{subGroup.content}</Text>
              </Body>

            </ListItem>
          </View>
        )
      }))
    // }
    }

    const RenderList = () => ((this.state.mainData).map((group, i) => {
      return (
        <View key={i} >
          <ListItem avatar onPress={() => navigation.navigate("chatScreen",
            JSON.parse(JSON.stringify({ group, userid: this.userid, sub: false })))}>
            <Left>
              <Thumbnail source={{ uri: group.image_uri }} />
            </Left>

            <Body>
              <Text>{group.name}</Text>
              <Text note numberOfLines={1}>{group.content}</Text>
            </Body>
            {group.key === 'journalists' ? null
              : <Icons
                style={styles.showSubsButton}
                name="plus-circle"
                size={25} id={group.key} onPress={() => this.handleClick(group)} />
            }
          </ListItem>
          {group.clicked && this.state.subData[group.key] ?
            <View>
              <RenderSubList groupKey={group.key} />
            </View> : null}
            {/* : this.state.mainData[this.state.currGroupIndex].clicked ?
              Alert.alert('meh')
              : null} */}
        </View>
      )
    })
    )

    return (

      <Container>
        <Content noLeft >
          <RenderList />
        </Content>
      </Container >

    );
  }

}

export default Groups;
