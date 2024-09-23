import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform,TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useSession } from '@/app/ctx';
export default function TabTwoScreen() {
  const router = useRouter();
  const { signOut, session } = useSession();

  return (
    <TouchableOpacity onPress={()=>{
      signOut()
    }}>
      <ThemedText type="link">Đăng xuất</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
