import React , {useEffect, useState} from 'react';
import { db } from '../firebase'
import { View , Text , SafeAreaView , TouchableOpacity , Image, FlatList , StyleSheet} from 'react-native';
import { Icon } from 'react-native-elements'
import { COLORS,icons, SIZES } from '../constants'


const Home = ({navigation}) => {
   const categoryData = [
     {
       id: 0,
       name: '  All'
     },
     {
       id: 1,
       name: 'Rice',
       icon: icons.rice_bowl,
     },
     {
       id: 2,
       name: 'Noodles',
       icon: icons.noodle,
     },
     {
       id: 3,
       name: 'Hot Dogs',
       icon: icons.hotdog,
     },
     {
       id: 4,
       name: 'Salads',
       icon: icons.salad,
     },
     {
       id: 5,
       name: 'Burgers',
       icon: icons.hamburger,
     },
     {
       id: 6,
       name: 'Pizza',
       icon: icons.pizza,
     },
     {
       id: 7,
       name: 'Snacks',
       icon: icons.fries,
     },
     {
       id: 8,
       name: 'Sushi',
       icon: icons.sushi,
     },
     {
       id: 9,
       name: 'Desserts',
       icon: icons.donut,
     },
     {
       id: 10,
       name: 'Drinks',
       icon: icons.drink,
     },
   ];
      const [categories, setCategories] = useState(categoryData);
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [ restaurants , setrestaurants] = useState(null)
      const [ selectedrestraunts , setselectedrestraunts] = useState(null);
      let isMounted = true;
      useEffect(()=>{
      const fetchrestaurants = async () => {
                db.collection('Restaurant')
                 .get()
                 .then((querySnapshot) => {
                         if (isMounted){
                           setrestaurants(
                             querySnapshot.docs.map((doc) => ({
                               id: doc.id,
                               data: doc.data(),
                             }))
                           );
                     setselectedrestraunts(
                     querySnapshot.docs.map((doc) => ({
                       id: doc.id,
                       data: doc.data(),
                     }))
                   );}
                 })
                 .catch((error) => {
                   console.log('Error getting document:', error);
                 });

      }
        fetchrestaurants();

        return () => (isMounted = false);
      },[])

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
           }}
         >
           <Image
             source={{
               uri: 'https://firebasestorage.googleapis.com/v0/b/orix-fa245.appspot.com/o/Layer%201.png?alt=media&token=43dda877-a634-4fb0-ba8f-7a293ae90899',
             }}
             style={{ height: 35, width: 40, resizeMode: 'contain'}}
           />
         </TouchableOpacity>
         <View
           style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
         ></View>
         <TouchableOpacity
           style={{
             backgroundColor: COLORS.primary,
             width: 40,
             height: 40,
             borderRadius: 10,
             justifyContent: 'center',
             alignItems: 'center',
           }}
           onPress={() => navigation.navigate('myprofile')}
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

   const renderMainCategories = () => {
     const selection = (item) => {
       setSelectedCategory(item)
       if(item.id !=0)
       {let selectedrestraunts = restaurants.filter(a=> a.data.categories.includes(item.id))
        setselectedrestraunts(selectedrestraunts);
        }
        else
        setselectedrestraunts(restaurants)
     }
    const rendercategory = ({item}) => {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: SIZES.padding2,
            backgroundColor:(selectedCategory?.id === item.id ? COLORS.primary : COLORS.white),
            borderColor:COLORS.tertiary,
            borderWidth:1/2,
            borderRadius: SIZES.radius / 2,
            marginRight: SIZES.padding2,
            height: 45,
          }}
          onPress={()=>{selection(item)}}
        >
          {item.id != 0 ? (<Image
            source={item.icon}
            resizeMode='contain'
            style={{ width: 23, height: 23, marginRight: SIZES.padding2 }}
          />) : null}
          <Text
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: 'black',
              marginRight: SIZES.padding,
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }    

     return (
       <View>
         <View style={{ padding: SIZES.padding2 * 2 }}>
           <Text style={{ fontSize: 30 ,fontWeight:'bold' }}>Let's eat</Text>
           <Text style={{ fontSize: 30 , fontWeight:'bold'}}>Quality Food</Text>
         </View>
         <FlatList
           data={categories}
           horizontal
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item) => `${item.id}`}
           renderItem={rendercategory}
           contentContainerStyle={{ paddingLeft:SIZES.padding2*2 , marginBottom:20 }}
         />
       </View>
     );
   }

   const renderRestaurants = () => {
     const renderItem = ({item : { data , id}}) => {
       const getCategoryNameById = (Id) => {
         let category = categories.filter((a) => a.id == Id)

         if(category.length > 0)
         return category[0].name
         else
         return ""

       }
       return (
         <TouchableOpacity
           style={{
             marginBottom: SIZES.padding * 2,
           }}
           onPress={()=>navigation.navigate('Restaurant' , {data , id})}
         >
           <View>
             <Image
               source={{ uri : data.photo}}
               resizeMode='cover'
               style={{
                 width: '100%',
                 height: 200,
                 borderRadius: SIZES.radius,
               }}
             />
             <View style = {{ position:'absolute', bottom:0 ,height:40, width: SIZES.width * 0.3, borderTopRightRadius:SIZES.radius, borderBottomLeftRadius:SIZES.radius , backgroundColor:COLORS.white , alignItems:'center', justifyContent:'center' , ...styles.shadow}}>
                <Text style={{fontWeight:'bold'}}>25-30 min</Text>
             </View>
           </View>
           <View style = {{marginLeft:SIZES.padding2 , marginTop:5}}>
             <Text style = {{fontSize:20 , fontWeight:'bold'}}>{data.name}</Text>
             <View style = {{flexDirection:'row', alignItems:'center'}}>
               <Image source={icons.star} style={{ tintColor:COLORS.primary , height:15 , width:15 , marginRight:5}} />
               <Text style = {{ marginRight:10}}>{data.rating}</Text>
               { data?.categories?.map((categoryId) => {
                 return(
                   <View style = {{ flexDirection:'row' , marginHorizontal: 3 , alignItems:'center'}} key={categoryId} >
                     <Text>{getCategoryNameById(categoryId)}</Text>
                     <Text style={{color:COLORS.darkgray}}> |</Text>
                   </View>
                 )
               })}
             </View>
           </View>
         </TouchableOpacity>
       );
     }
     return (
       <View>
         <FlatList
           data={selectedrestraunts}
           keyExtractor={(item) => `${item.id}`}
           renderItem={renderItem}
           contentContainerStyle={{ paddingHorizontal:SIZES.padding2*2 , paddingBottom: 250}}
         />
       </View>
     );
   }
    return (
      <SafeAreaView style = {{ flex : 1 , backgroundColor : COLORS.white , paddingTop : 30}}>
          {renderHeader()}
          {renderMainCategories()}
          {renderRestaurants()}
      </SafeAreaView>
    );
}

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
export default Home