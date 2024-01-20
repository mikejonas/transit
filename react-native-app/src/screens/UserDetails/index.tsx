import React, { useState, useRef } from 'react'
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  SafeAreaView,
} from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import Text from 'components/Text'
import { AppNavigationProps } from 'navigators/AppNavigator'
import { requests } from 'requests'

import CustomBottomSheetModal, { BottomSheetModalMethods } from './BottomSheetModal'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const UserDetails: React.FC = () => {
  const navigation = useNavigation<AppNavigationProps>() //todo fix any

  const [name, setName] = useState<string>('')
  const [birthLocation, setBirthLocation] = useState<string>('')
  const [dateSet, setDateSet] = useState<boolean>(false)
  const [timeSet, setTimeSet] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date(2000, 0, 1) // January is 0 in JavaScript's Date
    date.setHours(12, 0, 0, 0)
    return date
  })
  const timeSheetModalRef = useRef<BottomSheetModalMethods>(null)
  const dateSheetModalRef = useRef<BottomSheetModalMethods>(null)

  const renderDateSheet = () => {
    const handleDateChange = (event: DateTimePickerEvent, date?: Date | undefined) => {
      if (date) {
        const newDate = new Date(selectedDate)
        newDate.setFullYear(date.getFullYear())
        newDate.setMonth(date.getMonth())
        newDate.setDate(date.getDate())
        setSelectedDate(newDate)
      }
    }
    return (
      <CustomBottomSheetModal ref={dateSheetModalRef}>
        <Box mt="l">{renderTitle('Date of birth')}</Box>
        <Box flex={1} justifyContent="space-between">
          <Box />
          <DateTimePicker
            value={selectedDate}
            onChange={handleDateChange}
            mode="date"
            display={isIos ? 'spinner' : 'default'}
            themeVariant="dark" //todo: it's recommended to handle this with a theme
          />
          <Box />
          <Box />
          <Box />
        </Box>
        <Button
          title="Update date of birth"
          onPress={() => {
            dateSheetModalRef.current?.dismiss()
            setDateSet(true)
          }}
          size="medium"
        />
      </CustomBottomSheetModal>
    )
  }

  const renderTimeSheet = () => {
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
      }
    }
    return (
      <CustomBottomSheetModal ref={timeSheetModalRef}>
        <Box mt="l">{renderTitle('Time of birth')}</Box>
        <Box flex={1} justifyContent="space-between">
          <Box />

          <DateTimePicker
            value={selectedDate}
            onChange={handleTimeChange}
            mode="time"
            display={isIos ? 'spinner' : 'default'}
            minuteInterval={15}
            themeVariant="dark" //todo: it's recommended to handle this with a theme
          />
          <Box />
          <Box />
          <Box />
        </Box>
        <Button
          title="Update time of birth"
          onPress={() => {
            timeSheetModalRef.current?.dismiss()
            setTimeSet(true)
          }}
          size="medium"
        />
      </CustomBottomSheetModal>
    )
  }

  const renderTitle = (label: string) => {
    return (
      <Text variant="sectionTitle" textAlign="center">
        {label}
      </Text>
    )
  }

  const renderDescription = () => {
    return (
      <Text variant="body">
        We use NASA data to paint a complete picture of the sky when and where you were born. Our AI
        uses this information to personalize interactions, your chart, and your horoscopes to the
        moment you were born.
      </Text>
    )
  }

  const renderInputs = () => {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const formattedTime = selectedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return (
      <>
        <Box mb="m">
          <Input placeholder="Your name" value={name} onChangeText={setName} autoCorrect={false} />
        </Box>
        <Box mb="m">
          <Input
            placeholder="Date of birth"
            editable={false} // Disables editing and cursor
            value={dateSet ? formattedDate : undefined}
            onChangeText={setName}
            onPressIn={() => {
              dateSheetModalRef.current?.present()
              Keyboard.dismiss()
            }}
          />
        </Box>
        <Box mb="m">
          <Input
            placeholder="Time of birth"
            editable={false} // Disables editing and cursor
            value={timeSet ? formattedTime : undefined}
            showSoftInputOnFocus={false}
            onPressIn={() => {
              timeSheetModalRef.current?.present()
              Keyboard.dismiss()
            }}
          />
        </Box>
        <Box mb="m">
          <Input
            placeholder="Place of birth (todo)"
            value={birthLocation}
            onChangeText={setBirthLocation}
            autoCorrect={false}
          />
        </Box>
      </>
    )
  }

  const renderSignUpButton = () => {
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

    const isDisabled = !name || !dateSet || !timeSet
    return (
      <>
        <Button
          size="medium"
          title={'Sign up'}
          disabled={isDisabled}
          onPress={() => {
            if (isDisabled) {
              Keyboard.dismiss()
            } else {
              handleSubmit()
              Keyboard.dismiss()
            }
          }}
        />
      </>
    )
  }

  const isIos = Platform.OS === 'ios'

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Box flex={1} justifyContent="space-between" mx="m">
              <Box mt="m" mb="l">
                {renderTitle('Create account')}
              </Box>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                <Box mt="m" mb="xl">
                  {renderDescription()}
                </Box>
                {renderInputs()}
              </ScrollView>
              <Box my="m">{renderSignUpButton()}</Box>
            </Box>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {renderDateSheet()}
        {renderTimeSheet()}
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}

export default UserDetails
