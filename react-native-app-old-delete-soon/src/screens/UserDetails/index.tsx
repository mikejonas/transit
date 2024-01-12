import React, { useState } from 'react'
import { Platform, StyleSheet, Pressable } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import { AppNavigationProp } from 'navigators/AppNavigator'
import { requests } from 'requests'

const UserDetails: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>() //todo fix any

  const [name, setName] = useState<string>('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const handleDateChange = (event: DateTimePickerEvent, date?: Date | undefined) => {
    if (date) {
      const newDate = new Date(selectedDate)
      newDate.setFullYear(date.getFullYear())
      newDate.setMonth(date.getMonth())
      newDate.setDate(date.getDate())
      setSelectedDate(newDate)
      setShowDatePicker(false)
    }
  }

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date | undefined) => {
    if (date) {
      const minutes = Math.round(date.getMinutes() / 15) * 15
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        minutes,
      )
      setSelectedDate(newDate)
      setShowTimePicker(false)
    }
  }

  const handleSubmit = async () => {
    const { data, error } = await requests.edgeFunctions.addUserDetails({
      name,
      birthDate: selectedDate,
    })
    console.log({ data, error })
    if (data) {
      navigation.navigate('MainNavigator')
    }
  }

  const renderSectionHeader = (label: string, value?: string) => (
    <Box flexDirection="row" justifyContent="space-between" mb="s">
      <Text>{label}</Text>
      {value && <Text>{value}</Text>}
    </Box>
  )

  const formattedTime = selectedDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const formattedDate = selectedDate.toISOString().substring(0, 10)
  console.log({ showTimePicker })
  const isIos = Platform.OS === 'ios'
  return (
    <Box flex={1} justifyContent="center">
      <Box mb="l">
        <Box mb="xl" mx="m">
          {renderSectionHeader('Name')}
          <Input placeholder="How should we greet you?" value={name} onChangeText={setName} />
        </Box>
        <Box mb="xl" mx="m">
          <Pressable onPress={() => setShowDatePicker(true)}>
            {renderSectionHeader('Birth date', formattedDate)}
          </Pressable>
          {(isIos || showTimePicker) && (
            <DateTimePicker
              value={selectedDate}
              onChange={handleDateChange}
              mode="date"
              display={isIos ? 'spinner' : 'default'}
              style={styles.picker}
              themeVariant="dark" //todo: it's recommended to handle this with a theme
            />
          )}
        </Box>
        <Box mb="xl" mx="m">
          <Pressable onPress={() => setShowTimePicker(true)}>
            {renderSectionHeader('Birth time', formattedTime)}
          </Pressable>
          {(isIos || showTimePicker) && (
            <DateTimePicker
              value={selectedDate}
              onChange={handleTimeChange}
              mode="time"
              display={isIos ? 'spinner' : 'default'}
              minuteInterval={15}
              style={styles.picker}
              themeVariant="dark" //todo: it's recommended to handle this with a theme
            />
          )}
        </Box>
      </Box>

      <Box m="m">
        <Button size="medium" title={'Submit'} onPress={handleSubmit} />
      </Box>

      <TextButton onPress={() => requests.auth.signOut()}>(logout if you're stuck)</TextButton>
    </Box>
  )
}

export default UserDetails

const styles = StyleSheet.create({
  picker: {
    height: 150,
  },
})
