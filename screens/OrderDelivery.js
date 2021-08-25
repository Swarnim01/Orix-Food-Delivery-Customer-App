import React , {useEffect, useRef, useState} from 'react';
import { View, Text , Image, TouchableOpacity , StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { COLORS, icons, SIZES  } from '../constants';
import * as Location from 'expo-location';
import {Icon} from 'react-native-elements'
import mapStyle from '../constants/mapStyle';
import {phonecall , text} from 'react-native-communications'
import { GOOGLE_MAPS_API_ } from '@env';

const OrderDelivery = ({route , navigation }) => {
  const [ location , setlocation] = useState(null);
  const [ tolocation , settolocation] = useState({longitude:0 , latitude:0})
  const [fromlocation, setfromlocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [ restaurant , setrestaurant] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const mapRef = useRef(null)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('permission not granted')
        return;
      }

      let {coords : { latitude , longitude}} = await Location.getCurrentPositionAsync({ accuracy:Location.Accuracy.High});
      setlocation({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      settolocation({latitude , longitude})
    })();
  }, []);

  useEffect(() => {
     let { restaurant } = route.params;
     setrestaurant(restaurant);
  },[])
useEffect(() => {
  if(!restaurant)
  return;
  fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${restaurant?.name} Satna Madhya Pradesh&inputtype=textquery&fields=name,rating,geometry&key=${GOOGLE_MAPS_API_}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setfromlocation({
        latitude: data.candidates[0].geometry.location.lat,
        longitude: data.candidates[0].geometry.location.lng,
      });
    });
},[restaurant]);
  useEffect(() => {
    if(!tolocation || !fromlocation)
    return;
    mapRef.current.fitToCoordinates([tolocation , fromlocation], {
      edgePadding: {
        right: SIZES.width / 20,
        bottom: SIZES.height / 4,
        left: SIZES.width / 20,
        top: SIZES.height / 8,
      },
    });
  })
  console.log('tolocation' , tolocation)
  console.log('fromlocaiton' , fromlocation)
  const renderMap = () => {
    const destinationMarker = () => {
      return (
        <Marker
          coordinate={tolocation}
          title='Destination'
          description={'Home'}
        />
      );
    }
    const bikeMarker = () => {
      return (
        <Marker
          coordinate={fromlocation}
          anchor={{ x: 0.5, y: 0.5 }}
          title='Restaurant'
          description={restaurant?.name}
        >
          <Image
            source={icons.deliveryboy}
            resizeMode='contain'
            style={{ width: 35, height: 35 }}
          />
        </Marker>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          region={location}
          customMapStyle={mapStyle}
          mapType='mutedStandard'
          enable
        >
          {tolocation &&
            (tolocation?.latitude != 0 || tolocation?.longitude != 0) &&
            destinationMarker()}
          {fromlocation &&
            (fromlocation?.latitude != 0 || fromlocation?.longitude != 0) &&
            bikeMarker()}
          {tolocation &&
            fromlocation &&
            (tolocation?.latitude != 0 || tolocation?.longitude != 0) &&
            (fromlocation?.latitude != 0 || fromlocation?.longitude != 0) && (
              <MapViewDirections
                origin={fromlocation}
                destination={tolocation}
                apikey={GOOGLE_MAPS_API_}
                strokeColor={COLORS.tertiary}
                strokeWidth={5}
                lineDashPattern={[0]}
                optimizeWaypoints={true}
                onError={(errorMessage) => {
                  console.log(errorMessage);
                }}
              />
            )}
        </MapView>
      </View>
    );
  }
   const renderHeader = () => {
     return (
       <View
         style={{
           position: 'absolute',
           top: 30,
           left: 0,
           right: 0,
           justifyContent:'center'
         }}
       >
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
             onPress={() => navigation.replace('Home')}
           >
             <Icon
               name='home'
               type='font-awesome'
               size={22}
               resizeMode='contain'
             />
           </TouchableOpacity>
         </View>
       </View>
     );
   };

  const renderDeliveryInfo = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: SIZES.width * 0.9,
            paddingHorizontal: SIZES.padding * 1.5,
            paddingVertical: SIZES.padding * 1.5,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: COLORS.primary,
                width: 50,
                height: 50,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/orix-fa245.appspot.com/o/avatar-3.jpg?alt=media&token=8a8f5088-9cc8-40b6-9396-a2adccdc5bfc',
                }}
                resizeMode='contain'
                style={{ height: 40, width: 40 }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  {restaurant?.courier.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={icons.star}
                    style={{
                      tintColor: COLORS.primary,
                      height: 15,
                      width: 15,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ marginRight: 10 }}>{restaurant?.rating}</Text>
                </View>
              </View>
              <Text style={{ color: COLORS.darkgray }}>{restaurant?.name}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: SIZES.padding * 2,
            }}
          >
            <TouchableOpacity
              style={{
                height: 45,
                width: SIZES.width * 0.37,
                backgroundColor: COLORS.tertiary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => phonecall('0123456789', true)}
            >
              <Text style={{ fontWeight: 'bold' }}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 45,
                width: SIZES.width * 0.37,
                backgroundColor: COLORS.tertiary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => text('0123456789')}
            >
              <Text style={{ fontWeight: 'bold' }}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style = {{flex:1}} >
      {renderMap()}
      {renderHeader()}
      {renderDeliveryInfo()}
    </View>
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
export default OrderDelivery;
