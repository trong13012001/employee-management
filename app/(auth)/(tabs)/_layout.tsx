import { Tabs,useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Danh sách nhân viên',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people-sharp' : 'people-outline'} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity style={{paddingRight:20}} onPress={() => router.push('/(screen)/employee/create')}>
              <Ionicons name="person-add" size={24} color="#000"/>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Quản trị viên',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
