import React, { useEffect, useState , useRef } from 'react';
import { auth, db } from '../firebase';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';

import { Icon } from 'react-native-elements';
import { COLORS, icons, SIZES } from '../constants';
import { Directions } from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
    const [ user , setuser ] = useState(null);
    const [ orders , setorders ] = useState(null);
    const [ restaurant , setrestaurant ] = useState(null)
          let isMounted = true;
      let array = [1, 2 , 3];
      const scrollX = new Animated.Value(0);
      const position = Animated.divide(scrollX, SIZES.width);
      const translateX = position.interpolate({
        inputRange: [0, 1 , 2],
        outputRange: [0, SIZES.width/3 -10 , SIZES.width * 2/3 -10],
        extrapolate: 'clamp',
      });

      const scrollviewRef = useRef();
      const onscrollviewPress = (index) => {
        scrollviewRef?.current?.scrollTo({
          x: index * SIZES.width,
        });
      };
    useEffect(() => {
       const user = auth.currentUser;

       if (user) {
           setuser(user)
       }
    },[])

    useEffect(() => {
      const fetchOrders = async () => {
        let currentuser = auth.currentUser
          db.collection('User')
            .where('email', '==', currentuser?.email)
            .get()
            .then((querysnapshot) => {
              querysnapshot.forEach((doc) => {
                db.collection('User')
                  .doc(doc.id)
                  .collection('Orders')
                  .get()
                  .then((query) => {
                          if (isMounted) {
                            setorders(
                              query.docs.map((doc) => ({
                                id: doc.id,
                                data: doc.data(),
                              }))
                            );
                          }
                  });
              });
            });
      };

     fetchOrders();

      return () => (isMounted = false);
    }, []);

     useEffect(() => {
       const fetchrestaurants = async () => {
         db.collection('Restaurant')
           .get()
           .then((querySnapshot) => {
             setrestaurant(
               querySnapshot.docs.map((doc) => ({
                 id: doc.id,
                 data: doc.data(),
               }))
             );
           })
           .catch((error) => {
             console.log('Error getting document:', error);
           });
       };
       let isMounted = true;
       if (isMounted) fetchrestaurants();

       return () => (isMounted = false);
     }, []);
     
      const renderHeader = () => {

        const Onlogout = () => {
              auth.signOut()
              .then(() => {
                navigation.replace('loginsignup')
              })
              .catch((error) => {
                // An error happened.
              });
        }
        return (
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              paddingHorizontal: SIZES.padding * 2,
              alignItems: 'center',
              backgroundColor:COLORS.white
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.white,
                width: 40,
                height: 40,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                ...styles.shadow,
              }}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name='angle-left'
                type='font-awesome'
                size={22}
                resizeMode='contain'
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                MyProfile
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.white,
                width: 40,
                height: 40,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={()=>Onlogout()}
            >
              <Icon
                name='sign-out'
                type='font-awesome'
                size={22}
                resizeMode='contain'
              />
              <Text style={{fontSize:9}}>Logout</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const renderprofileDetails = () => {
          return (
            <View
              style={{
                height: 160,
                backgroundColor: COLORS.white,
                borderBottomLeftRadius: 40,
                borderBottomRightRadius: 40,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: SIZES.padding2 * 2,
                  paddingTop: SIZES.padding2 * 2,
                }}
              >
                <View
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 20,
                    backgroundColor: COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8,
                    marginRight: 20,
                  }}
                >
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/orix-fa245.appspot.com/o/avatar-5.jpg?alt=media&token=a3102db9-b324-4af3-aea3-6a6adc9ef41a',
                    }}
                    style={{ height: 50, width: 50, padding: SIZES.padding }}
                  />
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                    {user?.displayName}
                  </Text>
                  <Text style={{ color: COLORS.darkgray }}>{user?.email}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: SIZES.width / 3 - 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => onscrollviewPress(0)}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    Account
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: SIZES.width / 3 - 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => onscrollviewPress(1)}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    Payment Method
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: SIZES.width / 3 - 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => onscrollviewPress(2)}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    Orders
                  </Text>
                </TouchableOpacity>
              </View>
              <Animated.View
                style={{
                  borderBottomColor: COLORS.primary,
                  borderBottomWidth: 3,
                  width: 90,
                  marginLeft: 30,
                  marginTop: -2,
                  transform: [{ translateX }],
                }}
              ></Animated.View>
            </View>
          );
      }

      const renderdata = () => {
          return (
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
              {array.map((item, index) => {
                return (
                  <View
                    key={`auth-${index}`}
                    style={{
                      alignItems: 'center',
                      width: SIZES.width,
                      marginTop:SIZES.padding2
                    }}
                  >
                    {index == 2 && orders && restaurant && (
                      <ScrollView
                        style={{
                          height: SIZES.height * 0.65,
                          width:SIZES.width,
                        }}
                      >
                        {orders.map(({ data }, index) => {
                          let chosenrestaurant = restaurant.filter((x) => x.data.id == data.restaurantId )[0]
                          let menu = chosenrestaurant?.data?.menu?.filter(
                            (a) => a.menuId == data.menuId
                          )[0];
                          // console.log('chosenrestraunt', chosenrestaurant);
                          // console.log('menu', menu);
                          return (
                            <View
                              key={`order-${index}`}
                              style={{
                                marginBottom: SIZES.padding * 2,
                                paddingTop: SIZES.padding2 * 1.2,
                                marginHorizontal: SIZES.padding,
                                backgroundColor: COLORS.white,
                                borderRadius: 20,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  paddingHorizontal: SIZES.padding2,
                                  paddingVertical: SIZES.padding,
                                  alignItems: 'center',
                                }}
                              >
                                <Image
                                  source={{ uri: menu.photo }}
                                  style={{
                                    height: 80,
                                    width: 80,
                                    resizeMode: 'cover',
                                    marginRight: SIZES.padding2 * 2,
                                    borderRadius: 10,
                                  }}
                                />
                                <View style={{ flex: 1 }}>
                                  <Text
                                    style={{ fontWeight: 'bold', fontSize: 14 }}
                                  >
                                    {menu.name}
                                  </Text>
                                  <Text style={{ fontSize: 13 }}>
                                    Quantity : {data.qty}
                                  </Text>
                                </View>
                                <Text
                                  style={{ fontWeight: 'bold', marginRight: 5 }}
                                >
                                  Rs.{data.total}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  paddingHorizontal: SIZES.padding2,
                                  paddingVertical: SIZES.padding2,
                                  justifyContent: 'space-between',
                                }}
                              >
                                <TouchableOpacity
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 45,
                                    width: SIZES.width / 2.4,
                                    borderWidth: 1,
                                    borderColor: COLORS.tertiary,
                                  }}
                                  onPress={() =>
                                    navigation.navigate('OrderDelivery', {
                                      restaurant: chosenrestaurant.data,
                                    })
                                  }
                                >
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      color: COLORS.tertiary,
                                    }}
                                  >
                                    TRACK ORDER
                                  </Text>
                                </TouchableOpacity>
                                <View style={{opacity:0.2}}>
                                  <TouchableOpacity
                                    disabled={true}
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      height: 45,
                                      width: SIZES.width / 2.4,
                                      borderWidth: 1,
                                      borderColor: COLORS.black,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        color: COLORS.black,
                                      }}
                                    >
                                      RE-ORDER
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </ScrollView>
                    )}
                  </View>
                );
              })}
            </Animated.ScrollView>
          );
      }
      // console.log('user:', user);
      // console.log('res', restaurant);
      // console.log('orders', orders);
      return (
        <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.lightGray4, paddingTop: 30 }}
        >
        <View style = {{ height:30 , marginTop:-30 , backgroundColor:COLORS.white }}></View>
        {renderHeader()}
        {renderprofileDetails()}
        {renderdata()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default Profile;