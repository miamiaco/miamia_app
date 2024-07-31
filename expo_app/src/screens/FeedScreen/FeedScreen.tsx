import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Image as RNImage } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { supabase } from '../../utils/supabase';
import styles from './FeedScreen.styles';
import { Image as ExpoImage } from 'expo-image';

type Media = {
  id: string;
  caption: string | null;
  media_product_type: string | null;
  media_type: string | null;
  permalink: string | null;
  image_url_m: string | null; 
  image_url_l: string | null; 
  ig_business_account_username: string | null;
  thumbnail_url: string | null;
  width?: number;
  height?: number;
  timestamp: string | null;
  ig_media_id: string | null;
};

const getFirstParagraph = (caption: string | null): string | null => {
  if (!caption) return null;
  const paragraphs = caption.split('\n')[0];
  return paragraphs.charAt(0).toUpperCase() + paragraphs.slice(1).toLowerCase();
};

const MediaFeed: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const imageSizeCache: { [url: string]: { width: number, height: number } } = {};

  useEffect(() => {
    fetchMedia(page);
    console.log('page', page)
  }, [page]);

  const fetchMedia = async (page: number) => {
    setLoading(true);
    try {
      const offset = page * limit;
      const { data: mediaData, error } = await supabase
        .from('IG_Media')
        .select('*')
        .range(offset, offset + limit - 1);
      console.log('offset', offset)
      console.log('supabase media data', mediaData)
      if (error) {
        throw error;
      }

      const validMediaItems = mediaData.filter(media => media.image_url_m && media.id);
      console.log('Number of valid media items:', validMediaItems.length);

      const mediaItemsWithDimensions = await Promise.all(
        validMediaItems.map(async (media) => {
          try {
            const { width, height } = await getImageSize(media.image_url_m!);
            return { ...media, width, height };
          } catch (error) {
            //console.error('Error fetching image size:', error);
            return { ...media, width: 100, height: 100 }; // default dimensions
          }
        })
      );

      setMediaItems(prevItems => [...prevItems, ...mediaItemsWithDimensions]);
      setHasMore(validMediaItems.length === limit);
    } catch (error) {
      //console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageSize = (url: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
      if (imageSizeCache[url]) {
        resolve(imageSizeCache[url]);
      } else {
        RNImage.getSize(
          url,
          (width, height) => {
            imageSizeCache[url] = { width, height };
            resolve({ width, height });
          },
          (error) => reject(error)
        );
      }
    });
  };

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    setPage(prevPage => prevPage + 1);
  };

  const renderItem = ({ item }: { item: Media }) => {
    if (!item.image_url_m || !item.width || !item.height) {
      return null;
    }

    const aspectRatio = item.width / item.height;
    const containerWidth = (Dimensions.get('window').width / 2) - 16;
    const height = containerWidth / aspectRatio;

    return (
      <View style={styles.itemContainer}>
        <ExpoImage
          source={{ uri: item.image_url_m }}
          style={[{ width: containerWidth, height }, styles.image]}
          contentFit="cover"
        />
        {item.caption ? (
          <Text style={styles.caption}>{getFirstParagraph(item.caption)}</Text>
        ) : null}
        {item.ig_business_account_username ? (
          <Text style={styles.username}>{item.ig_business_account_username}</Text>
        ) : null}
      </View>
    );
  };

  if (loading && mediaItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!loading && mediaItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No media to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MasonryList
        style={{ alignSelf: 'stretch', marginTop: 120 }}
        contentContainerStyle={{
          paddingHorizontal: 8,
          alignSelf: 'stretch',
        }}
        numColumns={2}
        data={mediaItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      {loading && <Text style={styles.loadingText}>Loading more...</Text>}
    </View>
  );
};

export default MediaFeed;
