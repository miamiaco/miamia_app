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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    fetchMedia();
  }, [page]);

  const API_URL = 'https://miamiaapp-ronjakovero-ronjakoveros-projects.vercel.app';

  const fetchMedia = async () => {
    try {
      const offset = (page - 1) * limit;
      const response = await axios.get<Media[]>(`${API_URL}/media?limit=${limit}&offset=${offset}`);
      const mediaData = response.data;

      const validMediaItems = mediaData.filter(media => media.media_url && media.id);

      const mediaItemsWithDimensions = await Promise.all(
        validMediaItems.map(async (media) => {
          return new Promise<Media>((resolve) => {
            if (media.media_product_type === "REELS" || media.media_type === "VIDEO") {
              
              Image.getSize(
                media.thumbnail_url!,
                (width, height) => {
                  resolve({ ...media, width, height });
  
                },
                (error) => {
                  console.error('Error fetching video size:', error);
                  resolve(media);
                }
              );
            } else {
              Image.getSize(
                media.media_url!,
                (width, height) => {
                  resolve({ ...media, width, height });
  
                },
                (error) => {
                  console.error('Error fetching image size:', error);
                  resolve(media);
                }
              );
            }
          });
        })
      );

      

      setMediaItems(prevItems => [...prevItems, ...mediaItemsWithDimensions]);
      setHasMore(mediaItemsWithDimensions.length === limit);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching media:', error);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderItem = ({ item }: { item: Media }) => {
    if (!item.media_url || !item.width || !item.height) {
      console.warn('Invalid media item:', item);
      console.log(item.width, item.media_product_type)
      console.log(item.height, item.media_product_type)
      return null;
    }
    console.log(item.width, item.media_product_type)
    console.log(item.height, item.media_product_type)

    const aspectRatio = item.width / item.height;
    const containerWidth = (Dimensions.get('window').width / 2) - 16;
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
        style={{ alignSelf: 'stretch' }}
        contentContainerStyle={{
          paddingHorizontal: 8,
          alignSelf: 'stretch',
        }}
        numColumns={2}
        data={mediaItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      {loading && <Text style={styles.loadingText}>Loading more...</Text>}
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
  loadingText: {
    textAlign: 'center',
    padding: 10,
  },
});

export default MediaFeed;
