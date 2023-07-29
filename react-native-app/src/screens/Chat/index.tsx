import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Button, TextInput, FlatList, View, SafeAreaView} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme/restyle';
import Box from '../../components/Box';
import adjustColorBrightness from '../../utils/adjustColorBrightness';
import {botReply, mockBot, mockMessages, mockUser} from './mockMessages';
import ChatMessage from './ChatMessage';

interface User {
  avatar: string;
  name: string;
}

export interface Message {
  id: string;
  text: string;
  user: User;
}
/**
 * This is a rough hacked together version of chat ui. It would need to be cleaned up to build upon
 */

const ChatExample: React.FC = () => {
  const theme = useTheme<Theme>();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); // New state to track whether the bot is typing
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const createNewMessage = (id: number, text: string, user: User): Message => ({
    id: id.toString(),
    text,
    user,
  });

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({animated: false}), 0);
  };

  const simulateTyping = useCallback((initialIndex = 0, typingSpeed = 4) => {
    let i = initialIndex;
    setIsTyping(true);

    // Adding 2 second delay before typing
    setTimeout(() => {
      typingIntervalRef.current = setInterval(() => {
        if (i < botReply.length) {
          setMessages(previousMessages => {
            const lastMessage = previousMessages[previousMessages.length - 1];
            const newText =
              lastMessage.text + botReply.substring(i, i + typingSpeed);
            const updatedMessage = {...lastMessage, text: newText};

            const updatedMessages = [
              ...previousMessages.slice(0, -1),
              updatedMessage,
            ];

            scrollToBottom();
            return updatedMessages;
          });

          i += typingSpeed;
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            setIsTyping(false);
            setMessages(previousMessages => {
              const lastMessage = previousMessages[previousMessages.length - 1];
              const updatedMessage = {...lastMessage};

              const updatedMessages = [
                ...previousMessages.slice(0, -1),
                updatedMessage,
              ];
              scrollToBottom();
              return updatedMessages;
            });
          }
        }
      }, 40);
    }, 2000);
  }, []);

  const submitMockMessage = (mockMessageText: string) => {
    setMessage('');
    const lastMessageId = Number(messages[messages.length - 1].id);
    setMessages(previousMessages => {
      const newMessages = [
        ...previousMessages,
        createNewMessage(lastMessageId + 1, mockMessageText, mockUser),
        createNewMessage(lastMessageId + 2, '', mockBot),
      ];
      scrollToBottom(); // We call scrollToBottom here after a new message is added
      return newMessages;
    });

    simulateTyping();
  };

  useEffect(() => {
    // Clear typing interval on component unmount
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const getLastBotMessage = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].user === mockBot) {
        return messages[i];
      }
    }
    return null;
  };

  const lastBotMessage = getLastBotMessage();

  return (
    <View style={{flex: 1}}>
      <Box flex={1} backgroundColor="background">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ChatMessage
              item={item}
              isCursorActive={
                !!(lastBotMessage && lastBotMessage.id === item.id && isTyping)
              }
            />
          )}
          contentContainerStyle={{padding: theme.spacing.s}}
        />
        <SafeAreaView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: theme.spacing.s,
          }}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: theme.colors.text,
              color: theme.colors.text,
              borderRadius: 9,
              padding: theme.spacing.s,
            }}
            placeholder="Type your message here"
            placeholderTextColor={adjustColorBrightness(
              theme.colors.text,
              -0.25,
            )}
          />
          <Button title="Submit" onPress={() => submitMockMessage(message)} />
        </SafeAreaView>
      </Box>
    </View>
  );
};

export default ChatExample;
