import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import axios from 'axios';

type Media = {
  id: string;
  caption: string | null;
  media_product_type: string | null;
  media_type: string | null;
  permalink: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  width?: number;
  height?: number;
  timestamp: string | null;
  pageId: string;
  instagramBusinessAccountId: string | null;
};

const MediaFeed: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get<Media[]>('http://localhost:3000/media');
        const mediaData = response.data;

        console.log('Fetched media data:', mediaData);

        const validMediaItems = mediaData.filter(media => media.media_url && media.id);

        const mediaItemsWithDimensions = await Promise.all(
          validMediaItems.map(async (media) => {
            return new Promise<Media>((resolve) => {
              Image.getSize(
                media.media_url!,
                (width, height) => {
                  resolve({ ...media, width, height });
                  console.log('media size: width, height', width, height)
                },
                (error) => {
                  console.error('Error fetching image size:', error);
                  resolve(media);
                }
              );
            });
          })
        );

        console.log('Valid media items with dimensions:', mediaItemsWithDimensions);

        setMediaItems(mediaItemsWithDimensions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching media:', error);
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const renderItem = ({ item }: { item: Media }) => {
    if (!item.media_url || !item.width || !item.height) {
      console.warn('Invalid media item:', item);
      return null;
    }

    const aspectRatio = item.width / item.height;
    const containerWidth = Dimensions.get('window').width / 2 - 28; 
    const height = containerWidth / aspectRatio;

    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.media_url }}
          style={{ width: containerWidth, height }}
          resizeMode="cover"
        />
        {item.caption ? (
          <Text style={styles.caption}>{item.caption}</Text>
        ) : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No media to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MasonryList
        style={{ alignSelf: 'stretch' }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          alignSelf: 'stretch',
        }}
        numColumns={2}
        data={mediaItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  caption: {
    padding: 5,
    textAlign: 'center',
  },
});

export default MediaFeed;
