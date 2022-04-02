import {ImageSourcePropType} from 'react-native';

export interface Data {
  id: number;
  title: string;
  text: string;
  image: ImageSourcePropType;
}

export const data = [
  {
    id: 1,
    title: 'A bright start',
    text: 'This could contain something important',
    image: require('./assets/bird.jpg'),
  },
  {
    id: 2,
    title: "Now we're on fire! 🔥",
    text: 'This could contain something important too!',
    image: require('./assets/fire.jpg'),
  },
  {
    id: 3,
    title: 'Top of the world',
    text: 'And guess what this could contain?',
    image: require('./assets/view.jpg'),
  },
  {
    id: 4,
    title: 'A bright start',
    text: 'This could contain something important',
    image: require('./assets/bird.jpg'),
  },
  {
    id: 5,
    title: "Now we're on fire! 🔥",
    text: 'This could contain something important too!',
    image: require('./assets/fire.jpg'),
  },
  {
    id: 6,
    title: 'Top of the world',
    text: 'And guess what this could contain?',
    image: require('./assets/view.jpg'),
  },
  {
    id: 7,
    title: 'Top of the world',
    text: 'And guess what this could contain?',
    image: require('./assets/view.jpg'),
  },
];
