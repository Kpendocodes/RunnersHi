import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.homeButton}>
        <Text style={styles.homeText}>Home page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    color: '#232323',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f7f7f7',
  },
  button: {
    width: '100%',
    backgroundColor: '#232323',
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#232323',
    textDecorationLine: 'underline',
    marginTop: 14,
    marginBottom: 4
  },
  homeButton: {
    marginTop: 32,
    backgroundColor: '#232323',
    borderRadius: 7,
    paddingHorizontal: 22,
    paddingVertical: 9,
  },
  homeText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
