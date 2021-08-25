import React, { useEffect, useState } from 'react';
import { db , auth , firebase } from '../firebase';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  Animated
} from 'react-native';

import { Icon , BottomSheet} from 'react-native-elements';
import { COLORS,icons, SIZES} from '../constants';
import {GOOGLE_MAPS_API_} from '@env';

const Restaurant = ({route , navigation}) => {
  const [restaurant , setrestaurant ] = useState(null);
  const [finalOrder, setfinalOrder] = useState([]);
  const [ user , setuser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollX = new Animated.Value(0)
  useEffect(()=>{
    const { data } = route.params;
    const user = auth.currentUser;
    setuser(user)
    setrestaurant(data);
  },[])
  useEffect(() => {
    fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${restaurant?.name}&inputtype=textquery&fields=name,rating,geometry&key=${GOOGLE_MAPS_API_}`
    ).then((res)=> res.json())
    .then(data => console.log('data',data));
  });

    const editOrder = (action, menuId, price , restaurantId) => {
      let orderList = finalOrder.slice();
      let item = orderList.filter((a) => a.menuId == menuId);

      if (action == '+') {
        if (item.length > 0) {
          let newQty = item[0].qty + 1;
          item[0].qty = newQty;
          item[0].total = newQty * price;


          {user && db.collection('User')
            .where('email', '==', user?.email)
            .get()
            .then((querysnapshot) => {
              querysnapshot.forEach((doc) => {
                db.collection('User')
                  .doc(doc.id)
                  .collection('Orders').where('menuId' , '==' , item[0].menuId)
                  .limit(1).get().then((query) => {
                    query.forEach((document) => {
                      // console.log(document.id, ' => this is what you want ', document.data());
                       db.collection('User')
                         .doc(doc.id)
                         .collection('Orders')
                         .doc(document.id)
                         .update(item[0])
                         .then(() => {
                           console.log('Updated successfully');
                         })
                         .catch((error) => {
                           console.error('Error adding document: ', error);
                         });
                    })
                  })
              });
            });}


        } else {
          const newItem = {
            menuId: menuId,
            qty: 1,
            price: price,
            total: price,
          };
          orderList.push(newItem);


          {user && db.collection('User')
            .where('email', '==', user?.email)
            .get()
            .then((querysnapshot) => {
              querysnapshot.forEach((doc) => {
                db.collection('User')
                  .doc(doc.id)
                  .collection('Orders')
                  .add({...newItem , createdAt : firebase.firestore.FieldValue.serverTimestamp() , restaurantId: restaurantId})
                  .then((docRef) => {
                    console.log('Document written with ID: ', docRef.id);
                  })
                  .catch((error) => {
                    console.error('Error adding document: ', error);
                  });
              });
            });}


        }
        setfinalOrder(orderList);
      } else {
        if (item.length > 0) {
          if (item[0]?.qty > 1) {
            let newQty = item[0].qty - 1;
            item[0].qty = newQty;
            item[0].total = newQty * price;

            {user &&
              db
                .collection('User')
                .where('email', '==', user?.email)
                .get()
                .then((querysnapshot) => {
                  querysnapshot.forEach((doc) => {
                    db.collection('User')
                      .doc(doc.id)
                      .collection('Orders')
                      .where('menuId', '==', item[0].menuId)
                      .limit(1)
                      .get()
                      .then((query) => {
                        query.forEach((document) => {
                          // console.log(
                          //   document.id,
                          //   ' => this is what you want ',
                          //   document.data()
                          // );
                          db.collection('User')
                            .doc(doc.id)
                            .collection('Orders')
                            .doc(document.id)
                            .update(item[0])
                            .then(() => {
                              console.log('Updated successfully');
                            })
                            .catch((error) => {
                              console.error('Error adding document: ', error);
                            });
                        });
                      });
                  });
                });}
          }
          else{
            let newQty = item[0].qty - 1;
            item[0].qty = newQty;
            item[0].total = newQty * price;

            {user &&
              db
                .collection('User')
                .where('email', '==', user?.email)
                .get()
                .then((querysnapshot) => {
                  querysnapshot.forEach((doc) => {
                    db.collection('User')
                      .doc(doc.id)
                      .collection('Orders')
                      .where('menuId', '==', item[0].menuId)
                      .limit(1)
                      .get()
                      .then((query) => {
                        query.forEach((document) => {
                          // console.log(
                          //   document.id,
                          //   ' => this is what you want ',
                          //   document.data()
                          // );
                          db.collection('User')
                            .doc(doc.id)
                            .collection('Orders')
                            .doc(document.id)
                            .delete()
                            .then(() => {
                              console.log('Deleted successfully');
                            })
                            .catch((error) => {
                              console.error('Error adding document: ', error);
                            });
                        });
                      });
                  });
                });}
                orderList.splice(orderList.findIndex((a) => a.menuId == item[0].menuId ),1 )
          }
        }

        setfinalOrder(orderList);
      }
    }
    function getOrderQty(menuId) {
      let orderItem = finalOrder.filter((a) => a.menuId == menuId);

      if (orderItem.length > 0) {
        return orderItem[0].qty;
      }

      return 0;
    }
    function getBasketItemCount() {
      let itemCount = finalOrder.reduce((a, b) => a + (b.qty || 0), 0);

      return itemCount;
    }

    function sumOrder() {
      let total = finalOrder.reduce((a, b) => a + (b.total || 0), 0);

      return total;
    }

    const ViewCart = () => {
      setIsVisible(true)
    }
    
    const handleback = () => {
      if(finalOrder.length > 0)
      {
        finalOrder.map((item) => {
            db.collection('User')
              .where('email', '==', user?.email)
              .get()
              .then((querysnapshot) => {
                querysnapshot.forEach((doc) => {
                  db.collection('User')
                    .doc(doc.id)
                    .collection('Orders')
                    .where('menuId', '==', item.menuId)
                    .limit(1)
                    .get()
                    .then((query) => {
                      query.forEach((document) => {
                        // console
                        //   .log
                        //   document.id,
                        //   ' => this is what you want ',
                        //   document.data()
                        //   ();
                        db.collection('User')
                          .doc(doc.id)
                          .collection('Orders')
                          .doc(document.id)
                          .delete()
                          .then(() => {
                            console.log('Deleted successfully');
                          })
                          .catch((error) => {
                            console.error('Error adding document: ', error);
                          });
                      });
                    });
                });
              });
        })
        
      }
      navigation.goBack();
    }
    // console.log(finalOrder)
    // console.log(user)
    // console.log(restaurant)
  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          paddingHorizontal: SIZES.padding * 2,
          alignItems: 'center',
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
          onPress={() => handleback()}
        >
          <Icon
            name='angle-left'
            type='font-awesome'
            size={22}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            {restaurant?.name}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            width: 40,
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/orix-fa245.appspot.com/o/avatar-5.jpg?alt=media&token=a3102db9-b324-4af3-aea3-6a6adc9ef41a',
            }}
            resizeMode='contain'
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const renderFoodInfo = () => {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment='center'
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {restaurant?.menu?.map((item, index) => {
          return (
            <View key={`menu-${index}`} style={{ alignItems: 'center' }}>
              <View style={{ height: SIZES.height * 0.35 }}>
                <Image
                  source={{ uri: item.photo }}
                  resizeMode='cover'
                  style={{ width: SIZES.width, height: '100%' }}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    width: SIZES.width,
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: 25,
                      borderBottomLeftRadius: 25,
                      ...styles.shadow,
                    }}
                    onPress={() => {
                      editOrder('-', item.menuId, item.price , restaurant.id);
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...styles.shadow,
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>{getOrderQty(item.menuId)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopRightRadius: 25,
                      borderBottomRightRadius: 25,
                      ...styles.shadow,
                    }}
                    onPress={() => {
                      editOrder('+', item.menuId, item.price, restaurant.id);
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 20,
                  paddingHorizontal: SIZES.padding * 2,
                }}
              >
                <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>
                  {item.name} - Rs.{item.price}
                </Text>
                <Text>{item.description}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 5,
                }}
              >
                <Image
                  source={icons.fire}
                  style={{ height: 20, width: 20, marginRight: 5 }}
                />
                <Text style={{ fontWeight: 'bold', color: COLORS.darkgray }}>
                  {item.calories} cal
                </Text>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    );
  }

  const renderDots = () => {
    const dotPosition = Animated.divide( scrollX , SIZES.width );
    return(
      <View style = {{
        height:30
      }}>
        <View style = {{
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'center',
          height:SIZES.padding
        }}>
          {
            restaurant?.menu?.map((item , index)=>{
              const opacity = dotPosition.interpolate({
                inputRange:[index-1, index , index+1],
                outputRange:[0.3 , 1 , 0.3],
                extrapolate:'clamp'
              })

              const dotSize = dotPosition.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [SIZES.base, 10, SIZES.base],
                extrapolate:'clamp'
              });
              const dotRadius = dotPosition.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [4, 5, 4],
                extrapolate:'clamp'
              });
              const dotColor = dotPosition.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [COLORS.darkgray,COLORS.tertiary,COLORS.darkgray],
                extrapolate: 'clamp',
              });
              return(
                <Animated.View key={`dot-${index}`} opacity={opacity} style={{ borderRadius:dotRadius,marginHorizontal:6,width:dotSize,height:dotSize,backgroundColor:dotColor}} />
              )
            })
          }
        </View>
      </View>
    )
  }
  const renderOrderSection = () => {
    return (
      <View>
        {renderDots()}
        <View
          style={{
            backgroundColor: COLORS.lightGray4,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomColor: COLORS.darkgray,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>
              {getBasketItemCount()} items in Cart
            </Text>
            <Text style={{ fontWeight: 'bold' }}>Rs.{sumOrder()}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomColor: COLORS.darkgray,
              borderBottomWidth: 1,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={icons.pin}
                style={{ width: 20, height: 20, tintColor: COLORS.darkgray }}
              />
              <Text style={{ fontWeight: 'bold' }}> Location</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={icons.master_card}
                style={{ width: 20, height: 20, tintColor: COLORS.darkgray }}
              />
              <Text style={{ fontWeight: 'bold' }}> *** 9086</Text>
            </View>
          </View>
          <View
            style={{
              padding: SIZES.padding2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.tertiary,
                width: SIZES.width * 0.9,
                padding: SIZES.padding * 2,
                alignItems: 'center',
                borderRadius: SIZES.radius,
              }}
              onPress={() => ViewCart()}
            >
              <Text style={{ fontWeight: 'bold', color: COLORS.black }}>
                View in Cart
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const rendercart = () => {
    let GrandTotal = 0;
    let deliveryCharge = 50;
    return (
      <BottomSheet
        isVisible={isVisible}
        modalProps={{ onRequestClose: () => setIsVisible(false) }}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
      >
        <ScrollView
          style={{
            maxHeight: SIZES.height * 0.65,
            backgroundColor: COLORS.lightGray4,
          }}
        >
          {finalOrder.map((item, index) => {
            GrandTotal = GrandTotal + item.total;
            let menu = restaurant?.menu?.filter(
              (a) => a.menuId == item.menuId
            )[0];
            return (
              <View
                key={`order-${index}`}
                style={{
                  backgroundColor: COLORS.lightGray4,
                  paddingTop: SIZES.padding2 * 1.2,
                  marginHorizontal: SIZES.padding,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: SIZES.padding2 * 1.8,
                    paddingVertical: SIZES.padding,
                    alignItems: 'center',
                    backgroundColor: COLORS.white,
                    borderRadius: 20,
                  }}
                >
                  <Image
                    source={{ uri: menu.photo }}
                    style={{
                      height: 80,
                      width: 80,
                      resizeMode: 'cover',
                      marginRight: SIZES.padding2,
                      borderRadius: 10,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                      {menu.name}
                    </Text>
                    <Text style={{ fontSize: 13 }}>Quantity : {item.qty}</Text>
                  </View>
                  <Text style={{ fontWeight: 'bold' }}>Rs.{item.total}</Text>
                </View>
              </View>
            );
          })}
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: SIZES.padding2 * 1.2,
              margin: SIZES.padding,
              borderRadius: 20,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Bill Details</Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={{ color: COLORS.darkgray, fontSize: 13 }}>
                Item Total
              </Text>
              <Text style={{ color: COLORS.darkgray, fontSize: 13 }}>
                Rs.{GrandTotal}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.lightGray,
                height: 1,
                width: '100%',
                alignSelf: 'center',
                marginVertical: 12,
              }}
            ></View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={{ color: COLORS.darkgray, fontSize: 13 }}>
                Delivery Fee
              </Text>
              <Text style={{ color: COLORS.darkgray, fontSize: 13 }}>
                Rs.{deliveryCharge}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.lightGray,
                height: 1,
                width: '100%',
                alignSelf: 'center',
                marginVertical: 12,
              }}
            ></View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={{ color: COLORS.black, fontSize: 14 , fontWeight:'bold'}}>
                Grand Total
              </Text>
              <Text style={{ color: COLORS.black, fontSize: 13 , fontWeight:'bold'}}>
                Rs.{deliveryCharge + GrandTotal}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View
          style={{ backgroundColor: COLORS.lightGray4, alignItems: 'center' }}
        >
          <TouchableOpacity
            style={{
              height: 50,
              width: '95%',
              marginHorizontal: SIZES.padding2,
              marginBottom: SIZES.padding,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.tertiary,
            }}
            onPress={() => navigation.navigate('OrderDelivery', { restaurant })}
          >
            <Text style={{ fontWeight: 'bold', color: COLORS.white }}>
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: 30 }}
    >
      {renderHeader()}
      {renderFoodInfo()}
      {renderOrderSection()}
      {rendercart()}
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
export default Restaurant;
