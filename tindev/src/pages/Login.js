import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login({navigation}) {
  const [user, setUser] = useState('');

  useEffect(() => {
    try {
      AsyncStorage.getItem('user').then(user => {
        if (user) {
          navigation.navigate('Main', {user});
        }
      });
    } catch (error) {
      console.log('deu pau no use effect do login ' + error);
    }
  }, []);

  async function handleLogin() {
    try {
      console.log('antes do response');
      const response = await api.post('/devs', {username: user});

      console.log('antes do _id');
      const {_id} = response.data;

      console.log(_id);

      console.log('antes do asyncstorage');
      await AsyncStorage.setItem('user', _id);

      console.log('depois do asyncstorage');
      navigation.navigate('Main', {user: _id});
      console.log('depois do navigation!');
    } catch (error) {
      console.log('deu pau no response do handlelogin ' + error);
      console.log({message: error});
    }
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.container}>
      <Image source={logo} />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuário no Github"
        placeholderTextColor="#999"
        style={styles.input}
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text styles={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#df4723',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
