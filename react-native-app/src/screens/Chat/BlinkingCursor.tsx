import React, {useState, useEffect} from 'react';
import {View} from 'react-native';

const BlinkingCursor = () => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowCursor(prevShow => !prevShow);
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View
      style={{
        height: 20, // change this to match your desired cursor height
        width: 9,
        backgroundColor: showCursor ? '#888' : 'transparent',
        alignSelf: 'flex-end',
      }}
    />
  );
};

export default BlinkingCursor;
