import { TouchableOpacity } from 'react-native'
import { MainAppDrawerNavigationProps } from 'navigators/MainAppDrawerNavigator'
import DrawerIcon from '../../../assets/drawer-icon.svg'
import Box from 'components/Box'
import { useNavigation } from '@react-navigation/native'

const DrawerToggleButton = () => {
  const navigation = useNavigation<MainAppDrawerNavigationProps>()

  return (
    <Box ml="s">
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Box p="s">
          <DrawerIcon stroke="white" height={24} width={24} />
        </Box>
      </TouchableOpacity>
    </Box>
  )
}

export default DrawerToggleButton
