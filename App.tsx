import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Data, data} from './data';

const PaginationDots = () => (
  <View style={styles.dotContainer}>
    <View style={styles.dots} />
    <View style={styles.dots} />
    <View style={styles.dots} />
  </View>
);

export const App = () => {
  const renderItem = ({item, index}: {item: Data; index: number}) => (
    <View style={shadow}>
      <View style={styles.card} key={index}>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        contentContainerStyle={styles.flatListContainer}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: Data) => `${item.id}`}
      />
      <PaginationDots />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(243,243,243)',
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    alignItems: 'center',
  },
  card: {
    width: 350,
    height: 500,
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
  },
  shadow: {
    shadowRadius: 13,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  image: {width: 350, height: 300},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  flatListContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  dotContainer: {
    flex: 1,
    width: 250,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dots: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 10,
    backgroundColor: 'rgb(0,0,0)',
  },
});

const shadow = Platform.OS === 'ios' ? styles.shadow : {elevation: 2};
