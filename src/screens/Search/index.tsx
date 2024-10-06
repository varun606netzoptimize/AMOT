/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import React, {useContext, useState} from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';

// ** Third Party Imports

import {ScrollView} from 'react-native-virtualized-view';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

// ** Component Imports
import {Header} from '../../components/shared';

// ** Constant Imports
import {useDebouncedCallback} from 'use-debounce';
import {Button, TextField} from '../../components/custom';
import {COLORS, DEVICE, FONTS, KEYBOARD} from '../../constants';
import {search} from '../../redux/slices/search';
import {AppDispatch, useAppDispatch, useAppSelector} from '../../redux/store';

import {SCREENS} from '../../constants';
import MusicPlayerModal from '../MusicPlayerModal';
import {AuthContext} from '../../context/AuthContext';

const cancel = require('../../../assets/image/cancel.png');
const amotIcon = require('../../../assets/image/amot-icon.png');

import {useActiveTrack, useProgress} from 'react-native-track-player';
import PurchaseMembership from '../../components/modal/PurchaseMembership';

interface FormData {
  search: string;
}

type ItemProps = {
  id: number;
  title: string;
  url: ImageSourcePropType;
};

const SearchedCategories = ({
  id,
  title,
  url,
  navigation,
  has_subcategories,
  item,
  setShowPopUp,
}: ItemProps) => {
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
            setShowPopUp(true);
          } else {
            if (item.count == 1 && item.playlist_id) {178
              navigation.navigate(SCREENS.AUDIOS, {
                playListId: item?.playlist_id,
                showCategoryName: false,
                url: url,
              });
            } else {
              navigation.navigate(
                has_subcategories ? SCREENS.SUB_CATEGORY : SCREENS.PLAYLISTS,
                {
                  itemId: id,
                  name: title,
                  url: url,
                },
              );
            }
          }
        }}>
        <View
          style={
            url ? styles.cat_sub_container : styles.no_cat_image_container
          }>
          <Image
            style={url ? styles.cat_image : styles.no_cat_image}
            source={
              url
                ? {uri: url}
                : require('../../../assets/image/default-cat.png')
            }
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.cat_title}>
        {title.length > 13 ? title.slice(0, 13) + '...' : title}
      </Text>
    </View>
  );
};

const SearchedPlaylists = ({item, navigation, setShowPopUp}) => {
  const {subStatus} = useContext(AuthContext);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          console.log(item.membership_type);

          if (
            subStatus == 'free' &&
            item.membership_type.toLowerCase() == 'paid'
          ) {
            setShowPopUp(true);
          } else {
            navigation.navigate(SCREENS.AUDIOS, {
              playListId: item.id,
              name: item.title,
              url: null,
            });
          }
        }}
        disabled={!subStatus}>
        <View style={styles.single_playlist_container}>
          {item.title && (
            <View style={styles.flexShrink}>
              <Text style={styles.playlist_title}>
                {item.title?.length > 35
                  ? item.title.slice(0, 35) + '...'
                  : item.title}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

const SearchedTracks = ({item, navigation, setShowPopUp}) => {
  const {
    isPlayerActive,
    setupMusicPlayer,
    setCurrentPlaylistID,
    setCurrentCoverArt,
    SetCurrentPlaylistDetails,
    subStatus,
  } = useContext(AuthContext);

  const [showPlayer, setShowPlayer] = useState(false);

  let track = item?.url;
  let fileName = item?.name;

  let playlist = [{url: track, name: fileName}];
  let selectedTrack = {url: item?.url, title: item?.name};

  if (item?.url?.trim() !== '') {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (
              subStatus == 'free' &&
              item.membership_type.toLowerCase() == 'paid'
            ) {
              setShowPopUp(true);
            } else {
              SetCurrentPlaylistDetails({
                id: item.playlist_id,
                name: item.playlist_name,
              });
              setCurrentCoverArt(item?.thumbnail);
              setCurrentPlaylistID(item.playlist_id);
              setShowPlayer(true);
            }
          }}
          disabled={!subStatus}>
          <View style={styles.single_playlist_container}>
            {item.name && item.url && (
              <>
                <Image
                  style={styles.audio_image}
                  source={require('../../../assets/image/audioImage.png')}
                />
                <View style={styles.flexShrink}>
                  <Text style={styles.playlist_title}>
                    {item?.name?.trim().split(/ +/).join(' ').length > 35
                      ? item?.name?.trim().split(/ +/).join(' ').slice(0, 35) + '...'
                      : item?.name?.trim().split(/ +/).join(' ')}
                  </Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
        {showPlayer && (
          <MusicPlayerModal
          playlist={playlist}
          selectedTrack={selectedTrack}
          isVisible={showPlayer}
          close={() => setShowPlayer(false)}
          coverArt={item?.thumbnail}
        />
        )}
      </>
    );
  }
};

const Schema = yup.object().shape({
  search: yup.string().required('Username is a required field'),
});

const Search = ({navigation}) => {
  const [check, setCheck] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch<AppDispatch>();
  const searchData = useAppSelector((state: any) => state.search?.data);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({mode: 'onChange', resolver: yupResolver(Schema)});

  const handleSearch = useDebouncedCallback((value: string) => {
    if (value.length > 0) {
      setCheck(value);
    } else {
      setCheck('');
    }
    setIsLoading(true);

    dispatch(search(value)).then(() => {
      setIsLoading(false);
    });
  }, 1000);

  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.main_container}>
        <Header bgColor={COLORS.BASE} color={COLORS.TEXT} />
        <View style={styles.sub_container}>
          <Text style={styles.placeholder}>Search</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {value}}) => (
              <TextField
                value={value}
                onChangeText={(text: string) => handleSearch(text)}
                keyboardType={
                  Platform.OS === DEVICE.IOS
                    ? KEYBOARD.KEYBOARD_TYPE.DEFAULT
                    : KEYBOARD.KEYBOARD_TYPE.VISIBLE
                }
              />
            )}
            name="search"
          />

          {check.length > 0 && (
            <Text style={styles.search_audio_heading}>
              What do you want to listen to
            </Text>
          )}
        </View>

        {check.length > 0 &&
          searchData?.data?.categories?.length == 0 &&
          searchData?.data?.playlists.length == 0 &&
          searchData?.data?.tracks?.length == 0 && (
            <View style={styles.noSearch}>
              <Text style={styles.placeholder}>No Results Found</Text>
            </View>
          )}

        {check.length > 0 ? (
          isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={48} color={COLORS.SECONDARY} />
              <View style={{height: 114}} />
            </View>
          ) : (
            <ScrollView style={[styles.searched_sub_content_container]}>
              <View style={{maxHeight: 180}}>
                <FlatList
                  data={searchData?.data?.categories}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <SearchedCategories
                      id={item.id}
                      title={item.name}
                      url={item.thumbnail}
                      navigation={navigation}
                      has_subcategories={item.has_subcategories}
                      item={item}
                      setShowPopUp={setShowPopUp}
                    />
                  )}
                  keyExtractor={item => item.id.toString()}
                />
              </View>

              {searchData?.success && (
                <View style={{marginTop: 20}}>
                  <FlatList
                    data={[...searchData?.data?.playlists]}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                      <SearchedPlaylists
                        item={item}
                        navigation={navigation}
                        setShowPopUp={setShowPopUp}
                      />
                    )}
                    keyExtractor={(item, index) => index}
                  />
                  <FlatList
                    data={[...searchData?.data?.tracks]}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                      <SearchedTracks
                        item={item}
                        navigation={navigation}
                        setShowPopUp={setShowPopUp}
                      />
                    )}
                    keyExtractor={(item, index) => index}
                  />
                </View>
              )}

              <View style={{height: 56}} />
            </ScrollView>
          )
        ) : (
          <View style={styles.noSearchContainer}>
            <Text style={styles.empty_search_audio_heading}>
              What do you want to listen to?
            </Text>
            <Text style={styles.empty_search_audio_sub_heading}>
              Search audio files
            </Text>
          </View>
        )}
      </View>

      <PurchaseMembership
        hidePop={() => setShowPopUp(false)}
        showPopUp={showPopUp}
      />
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  flexShrink: {
    flexShrink: 1,
  },
  main_container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.BASE,
  },
  sub_container: {
    marginTop: '12%',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    width: '100%',
  },
  placeholder: {
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
    color: COLORS.TEXT,
    marginBottom: 15,
  },
  empty_search_audio_heading: {
    fontSize: 19,
    color: COLORS.SECONDARY,
    fontFamily: FONTS.BOLD,
  },
  search_audio_heading: {
    fontSize: 17,
    color: COLORS.SECONDARY,
    fontFamily: FONTS.BOLD,
    marginTop: 15,
  },
  empty_search_audio_sub_heading: {
    marginTop: '2%',
    fontFamily: FONTS.REGULAR,
    fontSize: 17,
    color: COLORS.TEXT,
  },
  searched_content_container: {
    width: '100%',
  },
  cat_main_container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: -40,
  },
  cat_sub_container: {
    width: 100,
    height: 100,
    marginRight: 10,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  no_cat_image_container: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.SECONDARY,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cat_image: {
    width: 95,
    height: 95,
  },
  cat_title: {
    width: 100,
    height: 60,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 12,
    marginTop: 4,
  },
  searched_sub_content_container: {
    width: '100%',
    flexDirection: 'column',
    paddingLeft: 15,
    paddingRight: 15,
  },
  single_playlist_container: {
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 0.5,
    borderColor: 'white',
    paddingBottom: 15,
    width: '98%',
    marginBottom: '5%',
  },
  audio_image: {
    width: 35,
    borderRadius: 100,
    height: 35,
  },
  playlist_title: {
    flexShrink: 1,
    color: COLORS.TEXT,
    fontFamily: FONTS.BOLD,
    fontSize: 17,
    lineHeight: 35,
  },
  noSearchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  noSearch: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  no_cat_image: {
    width: 59,
    height: 63,
    borderRadius: 0,
  },
});
