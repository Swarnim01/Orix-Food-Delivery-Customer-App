import React, { useEffect, useState , useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView ,
  Animated ,
  Alert
} from 'react-native';
import { auth , db }  from '../firebase';
import { Icon , Input} from 'react-native-elements';
import AppLoading from 'expo-app-loading';
import { COLORS, SIZES } from '../constants';
import LoadingScreen from '../components/LoadingScreen';

const loginsignup = ({ navigation }) => {
  
  const [ loading , isloading ] = useState(true);
  const [loader , showloader ] = useState(false)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home');
      } else {
        isloading(false)
      }
    });

    return unsubscribe;
  },[])
  const [username, setusername] = useState('');
  const [ email , setemail ] = useState('');
  const [password, setpassword] = useState('');
  let array = [ 1 , 2 ];
  const scrollX = new Animated.Value(0);
  const position = Animated.divide(scrollX , SIZES.width);
  const translateX = position.interpolate({
    inputRange: [0 , 1],
    outputRange: [0 , 205],
    extrapolate: 'clamp',
  });

  const scrollviewRef = useRef();
  const onscrollviewPress = (index) => {
    scrollviewRef?.current?.scrollTo({
        x : index * SIZES.width ,
    })
  }

  const OnRegister = () => {
    showloader(true)
      auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userCredential.user.updateProfile({
          displayName : username
        })
        db.collection('User')
          .add({
            displayName:username,
            email:userCredential.user.email
          })
          .then((docRef) => {
            console.log('Document ref : ', docRef);
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      })
      .catch((error) => {
        var errorMessage = error.message;
        showloader(false)
        Alert.alert(errorMessage);
      });
  }

  const Onlogin = () => {
    showloader(true);
      auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // console.log(userCredential)
        navigation.replace('Home')
      })
      .catch((error) => {
        var errorMessage = error.message;
        showloader(false)
        Alert.alert(errorMessage);
      });
  }
  const loginsignup = () => {
    return(
      <Animated.ScrollView
      ref={scrollviewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {array.map((item , index) => {
          return (
            <View
              key={`auth-${index}`}
              style={{
                paddingTop: SIZES.padding * 2,
                alignItems: 'center',
                width: SIZES.width / 1.1,
              }}
            >
              {index == 0 && (
                <View
                  style={{ backgroundColor: COLORS.lightGray4, height: 20 }}
                ></View>
              )}
              {index == 1 && (
                <Input
                  placeholder='Username'
                  value={username}
                  onChangeText={(text) => setusername(text)}
                />
              )}
              <Input
                placeholder='Email'
                value={email}
                onChangeText={(text) => setemail(text)}
              />
              <Input
                placeholder='Password'
                secureTextEntry
                value={password}
                onChangeText={(text) => setpassword(text)}
              />

              <TouchableOpacity
                style={{
                  height: 55,
                  width: '95%',
                  backgroundColor: COLORS.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}
                onPress={() => {
                  index == 1 ? OnRegister() : Onlogin();
                }}
              >
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                  CONTINUE
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </Animated.ScrollView>
    )
  }
  if (loading) {
    return (
      <AppLoading 
      />
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          bounces={false}
          style={{ backgroundColor: COLORS.lightGray4 }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.lightGray4,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                marginTop: -20,
                height: 20,
              }}
            ></View>
            <View
              style={{
                borderBottomLeftRadius: SIZES.radius,
                borderBottomRightRadius: SIZES.radius,
              }}
            >
              <Image
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/orix-fa245.appspot.com/o/login.png?alt=media&token=5f3be29b-c874-44cd-8ace-b7003e520659',
                }}
                style={{
                  width: '100%',
                  height: SIZES.height / 1.9,
                }}
                resizeMode='cover'
              />
            </View>
            <View
              style={{
                width: '100%',
                backgroundColor: COLORS.white,
                borderBottomLeftRadius: SIZES.radius * 1.3,
                borderBottomRightRadius: SIZES.radius * 1.3,
                flexDirection: 'row',
                height: 60,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                paddingTop: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  height: 60,
                  width: 150,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => onscrollviewPress(0)}
              >
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 60,
                  width: 150,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => onscrollviewPress(1)}
              >
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Signup</Text>
              </TouchableOpacity>
            </View>
            <Animated.View
              style={{
                borderBottomColor: COLORS.primary,
                borderBottomWidth: 3,
                marginTop: -2,
                width: 150,
                marginLeft: 35,
                transform: [{ translateX }],
              }}
            ></Animated.View>
            <View style={{ flex: 1, paddingHorizontal: SIZES.padding * 2 }}>
              {loginsignup()}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      {loader && <LoadingScreen />}
    </KeyboardAvoidingView>
  );
};


export default loginsignup;
