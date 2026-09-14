import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuthStore } from '../../src/core/store/authStore';

export default function ProfileScreen() {
  const { isAuthenticated, isGuest, logout, setGuestMode } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      
      {isAuthenticated ? (
        <View style={styles.card}>
          <Text style={styles.text}>Logged in</Text>
          <Button title="Logout" onPress={() => logout()} color="#d9534f" />
        </View>
      ) : isGuest ? (
        <View style={styles.card}>
          <Text style={styles.text}>Browsing as Guest</Text>
          <Button title="Register to Save Progress" onPress={() => {}} />
          <View style={{height: 10}}/>
          <Button title="Exit Guest Mode" onPress={() => setGuestMode(false)} color="#666" />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.text}>Welcome to KurazPrep!</Text>
          <Button title="Login" onPress={() => {}} />
          <View style={{height: 10}}/>
          <Button title="Continue as Guest" onPress={() => setGuestMode(true)} color="#0D7377" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
  text: { fontSize: 16, marginBottom: 16, textAlign: 'center' }
});
