import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function AppLayout() {


  return (
    <Stack>
      <Stack.Screen name="create" options={{
        title: 'Tạo nhân viên',
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={"#000"} />
            </TouchableOpacity>
          )
        },
      }} />

      <Stack.Screen name="update" 
      options={{
        title: 'Cập nhật nhân viên',
        headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={"#000"} />
              </TouchableOpacity>
            )
          },      }} />

    </Stack>
  )
}
