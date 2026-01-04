import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { getDiscussionAPI } from "@/utils/api";
import Toast from "react-native-root-toast";
import MediaGallery from "./media.gallery";
import CommentItem from "./comment.item";


const ForumDetailScreen = () => {
  const navigation = useNavigation();
  const { discussion_id, forum_name, course_code } = useLocalSearchParams()
  const [discussionDetail, setDiscussionDetail] = useState<IGetDiscussionAPI | null>(null)


  useEffect(() => {
    const fetchDiscussion = async () => {
      const res = await getDiscussionAPI(discussion_id as string)
      if (res && res.status === "success") {
        setDiscussionDetail(res)
      } else {
        Toast.show("Get detail discussion failed", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: "red",
          opacity: 1,
          position: Toast.positions.BOTTOM
        });
      }
    }
    fetchDiscussion()
  }, [])

  const formatPostTime = (iso: string) => {
    if (!iso) return "";

    // Parse time + cộng 7 tiếng (VN)
    const date = new Date(iso);
    date.setHours(date.getHours() + 7);

    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Vừa mới";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    ) {
      return `Hôm qua · ${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} · ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const countTotalComments = (comments: any[] = []): number => {
    return comments.reduce((sum, c) => {
      const repliesCount = c.replies && c.replies.length > 0 ? countTotalComments(c.replies) : 0;
      return sum + 1 + repliesCount;
    }, 0);
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={30} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{`${forum_name} - ${course_code}`}</Text>

        <TouchableOpacity>
          <Feather name="more-horizontal" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.postCard}>
          <View style={styles.userRow}>
            <Image
              source={{
                uri: discussionDetail?.data.user.avatar_url || "https://ui-avatars.com/api/?name=User"
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>{`${discussionDetail?.data.user.last_name} ${discussionDetail?.data.user.first_name}`}</Text>
              <Text style={styles.time}>{formatPostTime(discussionDetail?.data.created_at as string)}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.postTitle}>{discussionDetail?.data.title}</Text>

          {/* Content */}
          <Text style={styles.postContent}>
            {discussionDetail?.data.content}
          </Text>

          {discussionDetail?.data.media ?
            <MediaGallery media={discussionDetail?.data.media} />
            :
            <></>
          }

          {/* Actions */}
          <View style={styles.actionRow}>
            <View style={styles.actionItem}>
              <Feather name="thumbs-up" size={18} />
              <Text style={styles.actionText}>28</Text>
            </View>

            <View style={styles.actionItem}>
              <Feather name="message-circle" size={18} />
              <Text style={styles.actionText}>15</Text>
            </View>

            <Feather name="bookmark" size={18} />
          </View>
        </View>

        {/* COMMENT SECTION */}

        <Text style={styles.commentTitle}>
          BÌNH LUẬN ({countTotalComments(discussionDetail?.data.comment)})
        </Text>

        {discussionDetail?.data.comment.map((comment) => (
          <CommentItem
            key={comment.comment_id}
            comment={comment}
          />
        ))}
      </ScrollView>

      {/* INPUT COMMENT */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Viết bình luận..."
          style={styles.input}
        />
        <TouchableOpacity>
          <Feather name="send" size={20} color="#007ACC" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForumDetailScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-between",
  },
  headerTitle: {
    width: 300,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  container: {
    padding: 16,
    paddingBottom: 80,
  },

  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e53935",
    marginRight: 8,
  },
  username: {
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },

  postTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 6,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-between",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 4,
  },

  commentTitle: {
    fontWeight: "700",
    marginVertical: 8,
  },
  commentCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  commentText: {
    marginTop: 6,
    fontSize: 14,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginRight: 8,
  },
});
