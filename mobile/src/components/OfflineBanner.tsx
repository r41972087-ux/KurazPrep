import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';
import { WifiOff } from 'lucide-react-native';
import { colors } from '../core/theme/colors';

export const OfflineBanner = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // Basic polling for MVP (In prod, use react-native-netinfo for actual listeners)
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected ?? true);
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected) return null;

  return (
    <View style={styles.banner}>
      <WifiOff color="#fff" size={16} style={{ marginRight: 8 }} />
      <Text style={styles.text}>You are offline. Showing cached content.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    backgroundColor: colors.warning,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
