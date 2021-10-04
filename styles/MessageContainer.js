
import React from 'react';
import { Bubble } from 'react-native-gifted-chat';

export const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { backgroundColor: '#c6ecd9'},
        right: { backgroundColor:'#398ec6' },
      }}
      usernameStyle={{ color: '#595959', fontWeight: '100' }}
    />
);
