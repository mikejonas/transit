import React, { useState, useRef, useEffect } from 'react'
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
import { RootNavigationProps } from 'navigators/RootNavigator'
import { requests } from 'requests'

import CustomBottomSheetModal, { BottomSheetModalMethods } from './BottomSheetModal'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import TextButton from 'components/TextButton'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TextInput } from 'react-native-gesture-handler'
import { AutocompletePrediction } from '../../requests/utils'

const useGetLocationAutocomplete = (searchQuery: string) => {
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompletePrediction[]>([])

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['locationAutocomplete', searchQuery],
    queryFn: () => requests.edgeFunctions.locationAutocomplete({ searchQuery }),
    enabled: searchQuery.length > 2,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (!isFetching && data) {
      setAutocompleteResults(data.data.predictions)
    }
  }, [data, isFetching])

  useEffect(() => {
    if (searchQuery.length < 3) {
      setAutocompleteResults([])
    }
  }, [searchQuery])

  return {
    autocompleteResults, // Use this for rendering in your component
    isFetching,
    isError,
    error,
  }
}

const useUpdateUserDetails = () =>
  useMutation({ mutationFn: requests.edgeFunctions.addUserDetails })

const UserDetails: React.FC = () => {
  const navigation = useNavigation<RootNavigationProps>()
  const updateUserDetailsMutation = useUpdateUserDetails()
  const [selectedBirthPlace, setSelectedBirthPlace] = useState<AutocompletePrediction>()
  const [birthPlaceQuery, setBirthPlaceQuery] = useState<string>('')

  const {
    autocompleteResults, // Use this for rendering in your component
    isFetching: isLocationAutocompleteLoading,
    isError,
    error: locationError,
  } = useGetLocationAutocomplete(birthPlaceQuery)

  const [name, setName] = useState<string>('')
  const [dateSet, setDateSet] = useState<boolean>(false)
  const [timeSet, setTimeSet] = useState<boolean>(false)

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date(2000, 0, 1) // January is 0 in JavaScript's Date
    date.setHours(12, 0, 0, 0)
    return date
  })
  const dateSheetModalRef = useRef<BottomSheetModalMethods>(null)
  const timeSheetModalRef = useRef<BottomSheetModalMethods>(null)
  const placeSheetModalRef = useRef<BottomSheetModalMethods>(null)
  const placeSearchRef = useRef<TextInput>(null)

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
      <CustomBottomSheetModal ref={dateSheetModalRef} snapPoint="65%">
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
      <CustomBottomSheetModal ref={timeSheetModalRef} snapPoint="65%">
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

  const renderPlaceSheet = () => {
    return (
      <CustomBottomSheetModal ref={placeSheetModalRef} snapPoint="90%">
        <Box mt="l" mb="l">
          {renderTitle('Place of birth')}
        </Box>
        <Box mb="m" flex={1}>
          <Box mb="m">
            <Input
              placeholder="eg: Austin, TX"
              value={birthPlaceQuery}
              onChangeText={setBirthPlaceQuery}
              autoCorrect={false}
              ref={placeSearchRef}
              onSubmitEditing={() => {
                setTimeout(() => {
                  placeSearchRef.current?.focus()
                }, 0)
              }}
              returnKeyType="search"
            />
          </Box>
          {locationError && <Text>Error: {locationError.message}</Text>}
          {autocompleteResults.map(suggestion => (
            <Box p="xs" key={suggestion.place_id}>
              <Text
                onPress={() => {
                  setSelectedBirthPlace(suggestion)
                  setBirthPlaceQuery('')
                  placeSheetModalRef.current?.dismiss()
                }}>
                {suggestion.description}
              </Text>
            </Box>
          ))}
        </Box>
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
            editable={false}
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
            editable={false}
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
            placeholder="Place of birth"
            editable={false}
            value={selectedBirthPlace?.description}
            showSoftInputOnFocus={false}
            onPressIn={() => {
              placeSheetModalRef.current?.present()
              setTimeout(() => {
                placeSearchRef.current?.focus()
              }, 50)
            }}
          />
        </Box>
      </>
    )
  }

  const renderLogOutButton = () => {
    return (
      <TextButton onPress={() => requests.auth.signOut()}>(dev: logout if you're stuck)</TextButton>
    )
  }

  const renderSignUpButton = () => {
    const handleSubmit = () => {
      if (!name || !dateSet || !timeSet || !selectedBirthPlace) return
      updateUserDetailsMutation.mutate(
        {
          name,
          birthDate: selectedDate,
          birthLocation: selectedBirthPlace.description,
          birthLocationPlaceId: selectedBirthPlace.place_id,
        },
        { onSuccess: () => navigation.navigate('MainAppDrawerNavigator') },
      )
    }

    const isDisabled = !name || !dateSet || !timeSet || !selectedBirthPlace
    return (
      <>
        <Button
          size="medium"
          title={'Sign up'}
          disabled={isDisabled}
          isLoading={updateUserDetailsMutation.isPending}
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
              <Box />
            </Box>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {renderLogOutButton()}
        {renderDateSheet()}
        {renderTimeSheet()}
        {renderPlaceSheet()}
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}

export default UserDetails
