import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import axios from 'axios';
import styles from './FeedScreen.styles';

type Media = {
  id: string;
  caption: string | null;
  media_product_type: string | null;
  media_type: string | null;
  permalink: string | null;
  username: string;
  media_url: string | null;
  thumbnail_url: string | null;
  width?: number;
  height?: number;
  timestamp: string | null;
  pageId: string;
  instagramBusinessAccountId: string | null;
};

const getFirstParagraph = (caption: string | null): string | null => {
  if (!caption) return null;
  const paragraphs = caption.split('\n')[0];
  return paragraphs.charAt(0).toUpperCase() + paragraphs.slice(1).toLowerCase();

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
      return null;
    }

    const aspectRatio = item.width / item.height;
    const containerWidth = (Dimensions.get('window').width / 2) - 16;
    const height = containerWidth / aspectRatio;

    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.media_url }}
          style={[{ width: containerWidth, height }, styles.image]}
          resizeMode="cover"
        />
        {item.caption ? (
          <Text style={styles.caption}>{getFirstParagraph(item.caption)}</Text>
        ) : null}
        {item.username ? (
          <Text style={styles.username}>{item.username}</Text>
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      {loading && <Text style={styles.loadingText}>Loading more...</Text>}
    </View>
  );
};

export default MediaFeed;
