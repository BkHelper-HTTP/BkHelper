import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ForumDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Khai phá dữ liệu - CO3029</Text>

        <TouchableOpacity>
          <Feather name="more-horizontal" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* POST */}
        <View style={styles.postCard}>
          {/* User row */}
          <View style={styles.userRow}>
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>User name</Text>
              <Text style={styles.time}>03:00, 28/11/2025</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.postTitle}>Bài tập lớn 1</Text>

          {/* Content */}
          <Text style={styles.postContent}>
            Deadline: 16/11/2025.{"\n"}
            Presentation: 3 hoặc 4 tuần học cuối.{"\n"}
            Chào cả lớp, về nội dung học qua LMS:{"\n"}
            - File report, slides trình bày và giải thích kết quả.{"\n"}
            - Source code đưa lên github và chèn link vào report trang bìa
            (hoặc có thể nén).{"\n"}
            - Video trình bày với sự tham gia của tất cả thành viên trong nhóm
            (nếu không trình bày tại lớp), có thể đưa lên Youtube (đảm bảo video
            có thể truy cập được), và đưa link vào report trang bìa.{"\n"}
            Thời gian trình bày:{"\n"}
            - Trên lớp: &lt; 15ph.{"\n"}
            - Video: &lt; 20ph.
          </Text>

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
        <Text style={styles.commentTitle}>BÌNH LUẬN</Text>

        <View style={styles.commentCard}>
          <View style={styles.userRow}>
            <View style={[styles.avatar, { backgroundColor: "#ff5252" }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>User name</Text>
              <Text style={styles.time}>30/11/2025</Text>
            </View>
          </View>

          <Text style={styles.commentText}>Bình luận bài viết</Text>

          <View style={styles.commentActions}>
            <Feather name="thumbs-up" size={16} />
            <Text style={{ marginLeft: 4 }}>0</Text>

            <Text style={{ marginLeft: 12, color: "#007ACC" }}>
              2 câu trả lời
            </Text>
          </View>
        </View>
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
    fontSize: 16,
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
    marginTop: 10,
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
