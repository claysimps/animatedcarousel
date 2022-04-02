import React, {
  PropsWithChildren,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import {Data, data} from './data';

type SpringPressableType = (param: {id: number}) => void;
interface SpringPressableProps {
  id: number;
  onPress: SpringPressableType;
}
// spring animated pressable wrapper to wrap our card and pagination dots
const SpringPressable = ({
  id,
  onPress = () => {},
  children,
}: PropsWithChildren<SpringPressableProps>) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [animation] = useState(new Animated.Value(0));

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  const animatedStyle = {
    transform: [{scale}],
    backgroundColor: 'transparent',
  };

  const handleSpringAction = () => {
    setIsPressed(active => !active);
  };

  const handlePress = () => {
    onPress({id});
  };

  useLayoutEffect(() => {
    Animated.spring(animation, {
      toValue: isPressed ? 1 : 0,
      useNativeDriver: true,
      speed: 10,
      bounciness: 10,
    }).start();
  }, [animation, isPressed]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handleSpringAction}
        onPressOut={handleSpringAction}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

const PaginationDots = ({
  dots,
  activeDot,
  carouselXRef,
  onPress,
}: {
  dots: number;
  activeDot: number | null;
  carouselXRef: Animated.Value | Animated.AnimatedInterpolation;
  onPress: SpringPressableType;
}) => {
  const dotsMap = Array.from({length: dots}, (_, i) => i);
  const {width} = useWindowDimensions();
  return (
    <View style={styles({}).dotContainer}>
      {dotsMap.map((_, index) => {
        const isActive = index === activeDot;
        const inputRange = [
          (index - 2) * width,
          (index - 1) * width,
          index * width,
          index * width,
          (index + 1) * width,
          (index + 2) * width,
        ];
        const scale: unknown = carouselXRef.interpolate({
          inputRange,
          outputRange: [1, 1.5, 2, 2, 1.5, 1],
          extrapolate: 'clamp',
        });
        return (
          <SpringPressable id={index} key={index} onPress={onPress}>
            <Animated.View
              key={index}
              style={styles({isActive, scale: scale as number}).dots}
            />
          </SpringPressable>
        );
      })}
    </View>
  );
};

const renderItem = ({item, index}: {item: Data; index: number}) => (
  <SpringPressable id={index} onPress={() => {}}>
    <View style={shadow}>
      <View style={styles({}).card} key={index}>
        <Image style={styles({}).image} source={item.image} />
        <Text style={styles({}).title}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    </View>
  </SpringPressable>
);

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
  const scrollRef = useRef<FlatList>(null);

  const handleDotPress = ({id}: {id: number}) => {
    scrollRef.current?.scrollToIndex({
      index: id,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles({}).container}>
      <StatusBar />
      <Animated.FlatList
        ref={scrollRef}
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
        onPress={handleDotPress}
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
