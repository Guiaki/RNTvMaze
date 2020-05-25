import React, {useEffect, useState, useLayoutEffect} from 'react';
import {useContext} from '../../core/_root';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import theme from '../../themes/default';
import {ActivityIndicator, Dialog, Paragraph, Button} from 'react-native-paper';
import imageCacheHoc from 'react-native-image-cache-hoc';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CastList from '../../components/CastList';
import SeasonList from '../../components/SeasonList';

const CacheableImage = imageCacheHoc(Image, {
  validProtocols: ['http', 'https'],
});

const Details = ({navigation, route}) => {
  const {item} = route.params;
  const {state, actions} = useContext();
  const [collapse, setCollapse] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  useEffect(() => {
    if (!state.app.loading && state.app.show == null) {
      actions.app.requestShow(item.id);
    }
    if (!state.app.episodesLoading && state.app.episodes == null) {
      actions.app.requestEpisodes(item.id);
    }
  }, [
    actions.app,
    item.id,
    state.app.episodes,
    state.app.episodesLoading,
    state.app.loading,
    state.app.show,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name={'arrow-back'}
            style={styles.headerIcon}
            size={30}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name={'favorite'}
            style={styles.headerIcon}
            size={30}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CacheableImage
        style={{zIndex: -1, position: 'absolute', width: '100%', height: '85%'}}
        source={{uri: item.image.original}}
        permanent={false}
      />
      <ScrollView
        style={{
          paddingTop: 300,
          width: '100%',
        }}>
        <Text style={styles.movieTitle}>{item.name}</Text>
        <Text style={styles.movieInfo}>{`${item.premiered.split('-')[0]} - ${
          item.runtime
        } per episode`}</Text>
        <FlatList
          style={{marginLeft: 16}}
          horizontal={true}
          data={item.genres}
          renderItem={({item}) => <Text style={styles.genre}>{item}</Text>}
          keyExtractor={index => index}
        />
        <View
          style={{
            paddingBottom: 500,
            backgroundColor: theme.colors.dark_background,
            borderRadius: 16,
          }}>
          <Text style={styles.header}>Summary</Text>
          <Text numberOfLines={collapse ? 99 : 2} style={styles.summaryText}>
            {item.summary.replace(/(&nbsp;|<([^>]+)>)/gi, '')}
          </Text>
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={() => setCollapse(!collapse)}>
            <Icon
              name={collapse ? 'expand-less' : 'expand-more'}
              style={styles.headerIcon}
              size={30}
              color={theme.colors.white}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Cast</Text>
          {state.app.loading ? (
            <ActivityIndicator
              animating={true}
              style={{margin: 16}}
              color={theme.colors.red_primary}
            />
          ) : (
            state.app.show && <CastList show={state.app.show} />
          )}
          {state.app.episodesLoading ? (
            <View>
              <Text style={styles.header}>Seasons</Text>
              <ActivityIndicator
                animating={true}
                style={{margin: 16}}
                color={theme.colors.red_primary}
              />
            </View>
          ) : (
            state.app.episodes && (
              <SeasonList
                setDialogContent={setDialogContent}
                showDialog={setShowDialog}
                seriesName={item.name}
                episodes={state.app.episodes}
              />
            )
          )}
        </View>
      </ScrollView>
      <Dialog
        style={{
          backgroundColor: theme.colors.dark_background,
          borderRadius: 16,
          marginHorizontal: 48,
        }}
        visible={showDialog}
        onDismiss={() => setShowDialog(false)}>
        {dialogContent != null && (
          <View>
            <Image
              style={{
                width: '100%',
                height: 200,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
              source={{uri: dialogContent.image.original}}
            />
            <Text style={styles.header}>{dialogContent.name}</Text>
            <Text style={styles.dialogText}>
              {`Season ${dialogContent.season} - Episode ${
                dialogContent.number
              }`}
            </Text>
            <Text style={styles.header}>Summary</Text>
            <ScrollView>
              <Text style={styles.dialogText}>
                {dialogContent.summary.replace(/(&nbsp;|<([^>]+)>)/gi, '')}
              </Text>
            </ScrollView>
          </View>
        )}
        <TouchableOpacity
          style={styles.dialogButton}
          onPress={() => setShowDialog(false)}>
          <Icon
            name={'clear'}
            style={styles.headerIcon}
            size={36}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </Dialog>
    </View>
  );
};

export default Details;