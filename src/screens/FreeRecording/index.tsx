/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
// ** React Imports
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';

// ** Constant Imports
import {COLORS, FONTS, SCREENS} from '../../constants';

// ** Component Imports
import {Header, SearchBar} from '../../components/shared';
import {freePlaylists} from '../../redux/slices/freePlaylists';
import {AppDispatch, useAppDispatch, useAppSelector} from '../../redux/store';
import {AuthContext} from '../../context/AuthContext';

const Playlist = React.memo(
  ({id, title, url, audioLength, navigation}: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(SCREENS.AUDIOS, {
            playListId: id,
            name: title,
            url,
          })
        }
        activeOpacity={0.5}>
        <View style={styles.playlist_container}>
          <View style={styles.playlist_sub_container}>
            <Image
              style={styles.playlist_image}
              source={
                url
                  ? {uri: url}
                  : require('../../../assets/image/amotaudio.png')
              }
            />
          </View>
          <View style={styles.flexShrink}>
            <Text style={styles.playlist_title}>
              {title.length > 52 ? title.slice(0, 52) + '...' : title}
            </Text>
            <Text style={styles.total_audio_text}>
              {audioLength} audio files
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const FreeRecording = ({navigation}) => {
  const {isPlayerActive} = useContext(AuthContext);

  const dispatch = useAppDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);
  const [playlistsData, setPlaylistsData] = useState<any[]>([]);
  const loading = useAppSelector(state => state.free.loading);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const fetchData = async () => {
    try {
      const response = await dispatch(freePlaylists(page));
      const newData = response.payload.data;
      setPlaylistsData(prevData => [...prevData, ...newData]);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setIsLoadMore(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleLoadMore = () => {
    setIsLoadMore(true);
    setPage(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main_container}>
        {/* <StatusBar barStyle="light-content" backgroundColor={COLORS.BASE} /> */}
        <View style={styles.utility_container}>
          <Header bgColor={COLORS.BASE} color={COLORS.TEXT} />
          <SearchBar padding={15} />
        </View>
        <View style={styles.sub_container}>
          <View style={styles.btnTitleBox}>
          <Text style={styles.playlist_name}>Free audio recordings</Text>
          <TouchableOpacity
              style={styles.donateBtn}
              onPress={() => {
                Linking.openURL(
                  'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CELHAVKNDUKVN',
                );
              }}>
              <Text style={styles.donateText}>DONATE</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size={58} color={COLORS.SECONDARY} />
            </View>
          ) : (
            <View style={styles.container}>
              <FlatList
                data={playlistsData}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <Playlist
                    id={item.id}
                    title={item.post_title}
                    url={item.thumbnail}
                    audioLength={item.audios.length}
                    navigation={navigation}
                  />
                )}
                keyExtractor={(_, index: any) => index}
                contentContainerStyle={{gap: 20}}
                onEndReachedThreshold={0.1}
                onEndReached={handleLoadMore}
                ListFooterComponent={() =>
                  playlistsData.length !== 0 && (
                    <>
                      {isLoadMore && (
                        <ActivityIndicator color={COLORS.PRIMARY} />
                      )}
                      <View style={styles.list_footer_loader} />
                    </>
                  )
                }
              />
              {/* {isPlayerActive && <View style={{height: 82}} />} */}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FreeRecording;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
  flexShrink: {
    flexShrink: 1,
  },
  main_container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
  sub_container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: '4%',
    paddingRight: '4%',
  },
  donateBtn: {
    backgroundColor: '#CADB29',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 30,
  },
  donateText: {
    color: '#000000',
    fontSize: 13,
    fontFamily: FONTS.MEDIUM,
  },
  btnTitleBox:{
    marginBottom: '8%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  playlist_name: {
    color: COLORS.SECONDARY,
    fontSize: 18,
    fontFamily: FONTS.BOLD,
  },
  playlist_container: {
    flexDirection: 'row',
    gap: 20,
  },
  playlist_sub_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlist_image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  playlist_title: {
    flexShrink: 1,
    color: COLORS.TEXT,
    fontFamily: FONTS.BOLD,
    fontSize: 16,
  },
  total_audio_text: {
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 12,
  },
  utility_container: {
    backgroundColor: COLORS.BASE,
    justifyContent: 'space-between',
  },
  list_footer_loader: {
    height: 82,
  },
  load_more_text: {
    textAlign: 'center',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.SECONDARY,
  },
  loaderContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
});
