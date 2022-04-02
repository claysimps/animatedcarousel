import React, {useRef, useState} from 'react';
import {
  Animated,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import {Data, data} from './data';

const PaginationDots = ({
  dots,
  activeDot,
  carouselXRef,
}: {
  dots: number;
  activeDot: number | null;
  carouselXRef: Animated.Value | Animated.AnimatedInterpolation;
}) => {
  const dotsMap = Array.from({length: dots}, (_, i) => i);
  const {width} = useWindowDimensions();
  return (
    <View style={styles({}).dotContainer}>
      {dotsMap.map((_, index) => {
        const isActive = index === activeDot;
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];
        const scale: unknown = carouselXRef.interpolate({
          inputRange,
          outputRange: [1, 1.5, 1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={index}
            style={styles({isActive, scale: scale as number}).dots}
          />
        );
      })}
    </View>
  );
};

export const App = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const carouselXRef = useRef<Animated.Value>(new Animated.Value(0)).current;

  const viewConfigRef = useRef<{
    viewAreaCoveragePercentThreshold: number;
  }>({viewAreaCoveragePercentThreshold: 50});
  // eslint-disable-next-line no-spaced-func
  const onViewRef = useRef<
    ({viewableItems}: {viewableItems: ViewToken[]}) => void
  >(({viewableItems}) => {
    setActiveIndex(viewableItems[0]?.index);
  });

  const renderItem = ({item, index}: {item: Data; index: number}) => (
    <View style={shadow}>
      <View style={styles({}).card} key={index}>
        <Image style={styles({}).image} source={item.image} />
        <Text style={styles({}).title}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles({}).container}>
      <StatusBar />
      <Animated.FlatList
        viewabilityConfig={viewConfigRef.current}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: carouselXRef}}}],
          {useNativeDriver: true},
        )}
        onViewableItemsChanged={onViewRef.current}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        contentContainerStyle={styles({}).flatListContainer}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: Data) => `${item.id}`}
      />
      <PaginationDots
        activeDot={activeIndex}
        dots={data.length}
        carouselXRef={carouselXRef}
      />
    </SafeAreaView>
  );
};

interface StyleProps {
  isActive?: boolean;
  scale?: number;
}

const styles = ({isActive, scale = 1}: StyleProps) =>
  StyleSheet.create({
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
      backgroundColor: isActive ? 'rgb(31, 222, 51)' : 'rgb(0,0,0)',
      transform: [{scale}],
    },
  });

const shadow = Platform.OS === 'ios' ? styles({}).shadow : {elevation: 2};
