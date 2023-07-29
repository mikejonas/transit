import React from 'react';
import {Image} from 'react-native';
import Text from '../../components/Text';
import Box from '../../components/Box';
import {Message} from '.';
import BlinkingCursor from './BlinkingCursor';

const avatarSize = 25;
const marginLeftSize = 's'; // Corresponding to your theme spacing value

const ChatMessage: React.FC<{
  item: Message;
  isCursorActive?: Boolean;
}> = ({item, isCursorActive}) => (
  <Box marginBottom="s">
    <Box flexDirection="row" alignItems="center">
      <Image
        source={{uri: item.user.avatar}}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        }}
      />
      <Box marginLeft={marginLeftSize}>
        <Text variant="body">{item.user.name}</Text>
      </Box>
    </Box>
    <Box style={{marginLeft: avatarSize + 8}}>
      <Text variant="body">
        {item.text} {isCursorActive && <BlinkingCursor />}
      </Text>
    </Box>
  </Box>
);

export default ChatMessage;
