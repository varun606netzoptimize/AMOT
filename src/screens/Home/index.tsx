// ** React Imports
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';

// ** Constant Imports
import {COLORS, FONTS, SCREENS} from '../../constants';

// ** Dimensions Imports
import {horizontalScale} from '../../themes/Metrics';

// ** Component Imports
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SearchBar} from '../../components/shared';
import {AuthContext} from '../../context/AuthContext';
import {RootStackParamList} from '../../navigation/Stack';
import {categories} from '../../redux/slices/categories';
import {trendingItems} from '../../redux/slices/trendingItems';
import {AppDispatch, useAppDispatch, useAppSelector} from '../../redux/store';
import NoInternet from '../../components/shared/noInternet.tsx';
import Button from '../../components/custom/Button.tsx';
import PurchaseMembership from '../../components/modal/PurchaseMembership.tsx';

import TrackPlayer from 'react-native-track-player';

// ** Assets
const freeImage = require('../../../assets/image/freeIcon.png');
const cancel = require('../../../assets/image/cancel.png');

type ItemProps = {
  id: number;
  title: string;
  url: ImageSourcePropType;
  hasSubCat: boolean;
  navigation: any;
};

type CategoryProps = {
  id: number;
  name: string;
  thumbnail: ImageSourcePropType;
  has_subcategories: boolean;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const Trending = ({
  id,
  title,
  url,
  navigation,
  item,
  setShowPop,
}: ItemProps) => {
  const {subStatus} = useContext(AuthContext);

  return (
    <>
      <TouchableOpacity
        style={styles.trending_main_container}
        onPress={() => {
          if (
            subStatus == 'free' &&
            item.membership_type.toLowerCase() == 'paid'
          ) {
            setShowPop(true);
          } else {
            navigation.navigate(SCREENS.AUDIOS, {
              playListId: id,
              name: title,
              url,
            });
          }
        }}
        disabled={!subStatus}>
        <View style={styles.trending_sub_container}>
          <Image
            style={styles.trending_image}
            source={
              url ? {uri: url} : require('../../../assets/image/amot-icon.png')
            }
          />
        </View>

        <Text style={styles.trending_title}>{title}</Text>
      </TouchableOpacity>
    </>
  );
};

const Category = ({id, title, url, hasSubCat, navigation, item, setShowPop}: ItemProps) => {
  const imageUrl = typeof url === 'string' ? url : String(url);
  const truncatedTitle = title.length > 20 ? title.slice(0, 15) + '...' : title;

  const {subStatus} = useContext(AuthContext);

  return (
    <View style={styles.cat_main_container}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          if (
            subStatus == 'free' &&
            item?.membership_type?.toLowerCase() == 'paid'
          ) {
            setShowPop(true);
          } else {
            if (item.count == 1 && item.playlist_id) {
              navigation.navigate(SCREENS.AUDIOS, {
                playListId: item?.playlist_id,
                showCategoryName: false,
                url: imageUrl,
              });
            } else {
              navigation.navigate(
                hasSubCat ? SCREENS.SUB_CATEGORY : SCREENS.PLAYLISTS,
                {
                  itemId: id,
                  name: title,
                  url: imageUrl,
                },
              );
            }
          }
        }}>
        <View
          style={
            imageUrl ? styles.cat_sub_container : styles.no_cat_image_container
          }>
          <Image
            style={imageUrl ? styles.cat_image : styles.no_cat_image}
            source={
              imageUrl
                ? {
                    uri: imageUrl,
                  }
                : require('../../../assets/image/default-cat.png')
            }
          />
        </View>
      </TouchableOpacity>
      <View>
        <Text style={styles.cat_title}>{truncatedTitle}</Text>
      </View>
    </View>
  );
};

const Home = ({navigation}: {navigation: HomeScreenNavigationProp}) => {
  const {userInfo, isConnected, LogOutStep1, isLoggedIn, setLastActiveTrack, isPlayerActive} =
    useContext<any>(AuthContext);
  const dispatch = useAppDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const category = useAppSelector((state: any) => state.category.data);
  const trending = useAppSelector((state: any) => state.trending.data);

  const [showPop, setShowPop] = useState(false);

  const displayName = userInfo?.first_name
    ? userInfo.first_name
    : userInfo?.user_display_name && userInfo.user_display_name.length > 10
    ? userInfo.user_display_name.slice(0, 10) + '...'
    : userInfo?.user_display_name;

  useEffect(() => {
    if (isConnected) {
      refreshData();
      isLoggedIn();
    }
  }, [isConnected]);

  const refreshData = () => {
    setIsRefreshing(true);
    getCategories();
    getTrending();
  };

  const getCategories = () => {
    setIsLoading(true);
    dispatch(categories())
      .then(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsRefreshing(false);
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
            setLastActiveTrack();
          }
        }
      });
  };

  const getTrending = () => {
    dispatch(trendingItems(isConnected));
  };

  const renderCategories = (setShowPop) => {
    const rows = [];
    for (let i = 0; i < category.length; i += 3) {
      const rowItems = category.slice(i, i + 3);
      // If there are only two items in the row, add an invisible third item
      if (rowItems.length === 2) {
        rowItems.push({
          id: '',
          name: 'invisible',
          thumbnail: null,
          has_subcategories: false,
        });
      }
      rows.push(
        <View key={i} style={styles.sub_container}>
          {rowItems.map((item: CategoryProps) =>
            item.name != 'invisible' ? (
              <Category
                id={item.id}
                key={item.id}
                title={item.name}
                url={item.thumbnail}
                navigation={navigation}
                hasSubCat={item.has_subcategories}
                item={item}
                setShowPop={setShowPop}
              />
            ) : (
              <View key={item.id} style={styles.invisible_container} />
            ),
          )}
        </View>,
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.main_container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BASE} />
      <View style={styles.utility_container}>
        <View style={styles.user_container}>
          <Text style={styles.welcome_text}>Welcome, </Text>
          <Text style={styles.username_text}>{displayName}</Text>
        </View>
        <SearchBar />
      </View>
      {isConnected ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80}}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshData}
              colors={[COLORS.SECONDARY]}
              progressBackgroundColor={'COLORS.BASE'}
              // progressViewOffset={-40}
            />
          }>
          <View style={{paddingLeft: 15, paddingRight: 15, marginTop: 20}}>
            <Text style={styles.trending_audio_text}>Trending</Text>
          </View>
          <View style={{margin: 15, marginTop: 20}}>
            <FlatList
              data={trending.trending}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <Trending
                  id={item.id}
                  title={item.post_title}
                  url={item.thumbnail}
                  navigation={navigation}
                  item={item}
                  setShowPop={setShowPop}
                />
              )}
              keyExtractor={item => item.id.toString()}
            />
          </View>
          <View style={{paddingLeft: 15, paddingRight: 15}}>
            <Text style={styles.listen_free_text}>Listen for Free</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.FREE_RECORDING)}
              activeOpacity={0.5}>
              <View style={styles.listen_free_container}>
                <Image style={styles.listen_free_image} source={freeImage} />
                <Text style={styles.listen_free_sub_text}>
                  Listen to a large collection of free recordings
                </Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.browse_category_text}>Browse categories</Text>

            {isLoading ? (
              <View style={{marginTop: '16%'}}>
                <ActivityIndicator size={40} color={COLORS.SECONDARY} />
              </View>
            ) : (
              <SafeAreaView>{renderCategories(setShowPop)}</SafeAreaView>
            )}
          </View>

          <PurchaseMembership
            hidePop={() => setShowPop(false)}
            showPopUp={showPop}
          />
        </ScrollView>
      ) : (
        <NoInternet />
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.BASE,
    paddingTop: 15,
  },
  utility_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    marginTop: 20,
  },
  user_container: {
    flexDirection: 'row',
  },
  search_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trending_audio_text: {
    fontSize: 20,
    color: COLORS.TEXT,
    fontFamily: FONTS.BOLD,
  },
  search_text: {
    fontSize: 20,
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
  },
  welcome_text: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontFamily: FONTS.REGULAR,
  },
  username_text: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontFamily: FONTS.BOLD,
  },
  search_image: {
    width: 20,
    height: 20,
  },
  listen_free_container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
    flexDirection: 'row',
    borderRadius: 6,
    gap: 30,
    padding: 10,
    marginTop: 7,
  },
  listen_free_image: {
    width: 40,
    height: 32,
  },
  listen_free_text: {
    fontSize: 20,
    color: COLORS.TEXT,
    fontFamily: FONTS.BOLD,
    marginTop: 10,
  },
  listen_free_sub_text: {
    color: COLORS.BASE,
    fontFamily: FONTS.REGULAR,
    width: horizontalScale(260),
    fontSize: 16,
  },
  browse_category_container: {},
  browse_category_text: {
    marginTop: 28,
    fontSize: 20,
    color: COLORS.TEXT,
    fontFamily: FONTS.BOLD,
  },
  trending_main_container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
    width: 100,
  },
  trending_image: {
    width: '100%',
    height: '100%',
    // borderRadius: 8,
  },
  trending_title: {
    width: 100,
    fontFamily: FONTS.REGULAR,
    color: 'white',
    marginTop: 6,
    fontSize: 14,
  },
  cat_main_container: {
    marginTop: 15,
    marginBottom: 10,
  },
  cat_sub_container: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  no_cat_image_container: {
    width: 112,
    height: 112,
    backgroundColor: COLORS.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cat_image: {
    width: 108,
    height: 108,
    borderRadius: 0,
  },
  no_cat_image: {
    width: 59,
    height: 63,
    borderRadius: 0,
  },
  cat_title: {
    width: 100,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 14,
    marginLeft: 4,
    marginTop: 6,
  },
  sub_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trending_sub_container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY,
  },
  invisible_container: {
    width: 107,
    height: 107,
    opacity: 0,
  },

  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 24,
    borderWidth: 1,
    borderColor: '#CADB29',
    backgroundColor: 'black',
    width: '90%',
    borderRadius: 10,
  },
  modalText1: {
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 20,
    width: '80%',
    lineHeight: 28,
  },
  modalText2: {
    color: '#C0C0C0',
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
    lineHeight: 25,
    marginTop: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
    marginBottom: 6,
  },
  crossBtn: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 56,
    alignItems: 'center',
  },
  noTracksText: {
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    marginBottom: '30%',
  },
  cancelModalText: {
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    marginTop: 10,
  },
});
