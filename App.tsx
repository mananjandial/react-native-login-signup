import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';

const App = () => {
  const [activeForm, setActiveForm] = useState('signup');
  const [rememberMe, setRememberMe] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    const fetchSavedEmail = async () => {
      const email = await AsyncStorage.getItem('rememberedEmail');
      if (email) {
        setSavedEmail(email);
        setRememberMe(true);
      }
    };
    fetchSavedEmail();
  }, []);

  const SignUpValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password is too short').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
  });

  const LoginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleRememberMeToggle = async (email) => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      await AsyncStorage.setItem('rememberedEmail', email);
    } else {
      await AsyncStorage.removeItem('rememberedEmail');
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = '';
    let color = '';

    const lengthCriteria = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthCriteria && hasNumber && hasLower && hasUpper && hasSpecial) {
      strength = 'Strong';
      color = 'green';
    } else if (lengthCriteria && (hasNumber || hasLower || hasUpper)) {
      strength = 'Medium';
      color = 'orange';
    } else {
      strength = 'Weak';
      color = 'red';
    }

    setPasswordStrength({ strength, color });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./logo.png')} style={styles.logo} />
        <Text style={styles.motto}>
          <Text style={styles.mottoBlack}>We build software with </Text>
          <Text style={styles.mottoBlue}>solid foundation</Text>
        </Text>
      </View>

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={[styles.tab, activeForm === 'signup' && styles.activeTab]}
          onPress={() => setActiveForm('signup')}
        >
          <Text style={[styles.tabText, activeForm === 'signup' && styles.activeTabText]}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeForm === 'login' && styles.activeTab]}
          onPress={() => setActiveForm('login')}
        >
          <Text style={[styles.tabText, activeForm === 'login' && styles.activeTabText]}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {activeForm === 'signup' && (
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={SignUpValidationSchema}
          onSubmit={(values) => {
            alert('Sign Up Successful');
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                  placeholder="Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={(text) => {
                    handleChange('password')(text);
                    calculatePasswordStrength(text);
                  }}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

                {/* Password strength indicator */}
                <Text style={{ color: passwordStrength.color, marginTop: 5 }}>
                  {passwordStrength.strength}
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.confirmPassword && errors.confirmPassword ? styles.inputError : null]}
                  placeholder="Confirm Password"
                  secureTextEntry
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                {errors.confirmPassword && touched.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      )}

      {activeForm === 'login' && (
        <Formik
          initialValues={{ email: savedEmail || '', password: '' }}
          validationSchema={LoginValidationSchema}
          onSubmit={(values) => {
            alert('Login Successful');
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.rememberMeContainer}>
                <TouchableOpacity onPress={() => handleRememberMeToggle(values.email)}>
                  <Text style={styles.rememberMeText}>{rememberMe ? '✓' : '☐'} Remember Me</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#E1F5FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  motto: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333'
  },
  mottoBlack: {
    color: '#333',
  },
  mottoBlue: {
    color: '#6200ee',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 22,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  activeTab: {
    backgroundColor: '#6200ee',
  },
  tabText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    padding: 25,
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 22, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,  
 
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  rememberMeContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 16,
    color: '#6200ee',
  },
});

export default App;