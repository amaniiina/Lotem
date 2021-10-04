import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {  renderActions, renderSend } from '../styles/InputToolbar'
import {renderBubble, renderSystemMessage} from '../styles/MessageContainer';
import firebase from "../config/Firebase"
import 'react-native-get-random-values'
import {v4 as uuidv4} from 'uuid'

firebase.firestore().settings({ experimentalForceLongPolling: true });

const db = firebase.firestore();

class Chat extends React.Component {

    constructor(props) {
        super(props);
        // group key always equals doc's id
        this.userid = this.props.route.params.userid;
        if(this.props.route.params.sub=== true){
            this.subGroup = this.props.route.params.group
            this.groupKey = this.props.route.params.parentGroupKey;
            this.messagesRef = firebase.firestore().collection('Groups').doc(this.groupKey)
            .collection('subGroups').doc(this.subGroup.key).collection('messages')
        }else{
            this.subGroup= null
            this.groupKey = this.props.route.params.group.key
            this.messagesRef = firebase.firestore().collection('Groups').doc(this.groupKey).collection('messages')
        }
        this.state = {
            _id: '',
            oldMessages: [],
            username: "",
            avatar: "",
        }
    }

    // check updates
    componentDidMount() {
        db
            .collection('Users')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    if (doc.data().Uid === this.userid) {
                        this.setState({ username: doc.data().Username })
                        this.setState({ avatar: doc.data().avatar })
                    }
                })
            });

        this.unsubscribe = this.messagesRef
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => {
                querySnapshot.docChanges().forEach(change => {
                    const x = change.doc.data()
                    const y = x.createdAt.toDate()
                    x.createdAt = y
                    this.setState(prevState => ({
                        oldMessages: GiftedChat.append(prevState.oldMessages, x)
                    }), () => {
                        let ref
                        if (this.subGroup) 
                            ref = db.collection('Groups').doc(this.groupKey)
                                .collection('subGroups').doc(this.subGroup.key)
                        else 
                            ref = db.collection('Groups').doc(this.groupKey)

                        if (this.state.oldMessages.length > 0) 
                            ref.update({ content:  change.doc.data().text==''?'Image attached':change.doc.data().text })
                        else 
                            ref.update({ content: 'No Messages Yet' })
                        }
                    )
                });
            })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    onSend(messages) {
        let currDate=firebase.firestore.Timestamp.fromDate(new Date())
        messages.map(message => {
            return this.messagesRef.add({
                _id: uuidv4(),
                text: message.text,
                createdAt: currDate,
                user: {
                    _id: this.userid,
                    name: this.state.username,
                    avatar: this.state.avatar,
                },
            })
        })
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.oldMessages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: this.userid,
                    name: this.state.username,
                    avatar: this.state.avatar,
                }}
                alignTop
                showUserAvatar //(current user)
                scrollToBottom
                renderAvatarOnTop
                showAvatarForEveryMessage={false}
                renderUsernameOnMessage
                renderActions={renderActions} //extra actions on input toolbar ()
                groupKey={this.props.route.params.sub? this.subGroup.key:this.groupKey}
                username={this.state.username}
                avatar={this.state.avatar}
                userid={this.userid}
                messagesRef={this.messagesRef}
                renderSend={renderSend} //send icon
                renderBubble={renderBubble} //bubble parts design
                renderSystemMessage={renderSystemMessage}
                isCustomViewBottom

            />
        )
    }

}

export default Chat;




        //delete all messages in group- didn't work, delete isn't a func
        // this.messagesRef.get()
        // .then(querySnapshot => {
        //     querySnapshot.forEach(function(doc) {
        //         doc.delete().then(function() {
        //             console.log("Document successfully deleted!");
        //         }).catch(function(error) {
        //             console.error("Error removing document: ", error);
        //         });
        //     })
        // })



 // const messagesListener = this.messagesRef
        //     .orderBy('createdAt', 'desc')
        //     .onSnapshot(querySnapshot => {
        //         const messages = querySnapshot.docs.map(doc => {
        //             const firebaseData = doc.data();

        //             const data = {
        //                 _id: doc.id,
        //                 text: '',
        //                 createdAt: new Date().getTime(),
        //                 ...firebaseData
        //             };
        //             console.log(data.text)              /////////////////
        //             if (!firebaseData.system) {
        //                 data.user = {
        //                     ...firebaseData.user,
        //                     name: firebaseData.user.email
        //                 };
        //             }

        //             return data;
        //         });
        //     //     console.log(messages[0].text)
        //     this.setState(prevState => {
        //         const oldMessages=  [...prevState.oldMessages, messages]
        //         return oldMessages
        //     })
        //     // setMessages(messages);
        //     });
        // messagesListener();


                // alwaysShowSend
      // showUserAvatar //(current user)
      // onPressAvatar={console.log}
      // renderAvatar={null}
      // renderInputToolbar={renderInputToolbar} //whole input toolbar 
      // renderComposer={renderComposer} //the text part of input toolbar
      // renderAvatar={renderAvatar}
      // renderMessage={renderMessage}
      // renderMessageText={renderMessageText}
      // // renderMessageImage
      // renderCustomView={renderCustomView}
      // messagesContainerStyle={{ backgroundColor: 'indigo' }}
      // parsePatterns={(linkStyle) => [
      //   {
      //     pattern: /#(\w+)/,
      //     style: linkStyle,
      //     onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
      //   },
      // ]}