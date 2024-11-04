import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThreadComposer from "@/components/ThreadComposer";
import Thread from "@/components/Thread";
import { Doc } from "@/convex/_generated/dataModel";
import { Href, Link, useNavigation } from "expo-router";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";
const Page = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    { initialNumItems: 5 }
  );

  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const onLoadMore = () => {
    loadMore(5);
  };

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  //Animation

  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const updateTabbar = () => {
    let newMarginBottom = 0;
    if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
      newMarginBottom = -scrollOffset.value;
    } else if (scrollOffset.value > tabBarHeight) {
      newMarginBottom = -tabBarHeight;
    }

    navigation
      .getParent()
      ?.setOptions({ tabBarStyle: { marginBottom: newMarginBottom } });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabbar)();
      }
    },
  });

  return (
    <Animated.FlatList
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      data={results}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <Link href={`/(auth)/(tabs)/feed/${item._id}` as Href} asChild>
          <TouchableOpacity>
            <Thread
              style={{ marginBottom: index === results.length - 1 ? 40 : 0 }}
              thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
            />
          </TouchableOpacity>
        </Link>
      )}
      keyExtractor={(item) => item._id}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: "#808080",
          }}
        ></View>
      )}
      contentContainerStyle={{ marginVertical: top }}
      ListHeaderComponent={() => (
        <View style={{ paddingBottom: 16 }}>
          <Image
            source={require("@/assets/images/threads-logo-black.png")}
            style={{ width: 40, height: 30, alignSelf: "center" }}
          />
          <ThreadComposer isPreview />
        </View>
      )}
    />
  );
};
export default Page;
const styles = StyleSheet.create({});
