import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { getDiscussionAPI, UpdateDiscussionAPI, DeleteDiscussionAPI, UploadImageAPI, DeleteImageAPI, CreateCommentAPI, ReplyCommentAPI, UpdateCommentAPI, DeleteCommentAPI } from "@/utils/api";
import Toast from "react-native-root-toast";
import MediaGallery from "./media.gallery";
import * as ImagePicker from "expo-image-picker";
import CommentItem from "./comment.item";


const ForumDetailScreen = () => {
  const navigation = useNavigation();
  const { discussion_id, forum_name, course_code } = useLocalSearchParams()
  const [discussionDetail, setDiscussionDetail] = useState<IGetDiscussionAPI | null>(null)
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [commentText, setCommentText] = useState("");


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

  const saveEdit = async () => {
    if (!discussion_id) return;
    try {
      setIsProcessing(true);
      const forumId = discussionDetail?.data.forum_id;
      if (!forumId) {
        Toast.show('Không tìm thấy forum id', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
        setIsProcessing(false);
        return;
      }
      const res = await UpdateDiscussionAPI(discussion_id as string, forumId as string, editTitle, editContent);
      if (res && (res as any).status === "success") {
        Toast.show('Cập nhật thành công', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'green', opacity: 1, position: Toast.positions.BOTTOM });
        const refreshed = await getDiscussionAPI(discussion_id as string);
        if (refreshed && refreshed.status === 'success') setDiscussionDetail(refreshed);
        setIsEditing(false);
      } else {
        const msg = (res as any)?.message ?? 'Không thể cập nhật bài thảo luận';
        Toast.show(msg, { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      }
    } catch (err: any) {
      if (err?.response?.status === 403) {
        Toast.show('Bạn không có quyền thực hiện thao tác này', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      } else {
        Toast.show('Lỗi khi cập nhật', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const pickAndUploadImage = async () => {
    if (!discussion_id) return;
    try {
      setIsProcessing(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show('Cần quyền truy cập thư viện ảnh', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (result.canceled || !result.assets || result.assets.length === 0) return;
      const asset = result.assets[0];
      const uri = asset.uri;
      const name = uri.split('/').pop() || `upload.jpg`;
      const match = /\.(\w+)$/.exec(name);
      const ext = match ? match[1].toLowerCase() : 'jpg';
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
      const formData = new FormData();
      formData.append('file', { uri: uri, name: name, type: mime } as any);

      const res = await UploadImageAPI(formData, discussion_id as string);
      if (res && (res as any).status === 'success') {
        Toast.show('Upload ảnh thành công', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'green', opacity: 1, position: Toast.positions.BOTTOM });
        const refreshed = await getDiscussionAPI(discussion_id as string);
        if (refreshed && refreshed.status === 'success') setDiscussionDetail(refreshed);
      } else {
        const msg = (res as any)?.message ?? 'Không thể upload ảnh';
        Toast.show(msg, { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      }
    } catch (err: any) {
      Toast.show('Lỗi khi upload ảnh', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteImage = async (media_id: string) => {
    try {
      setIsProcessing(true);
      const res = await DeleteImageAPI(media_id);
      // Backend may return 'deleted' or 'success'
      const ok = res && ((res as any).status === 'deleted');
      if (ok) {
        // Optimistically remove the media from local state so UI updates immediately
        setDiscussionDetail((prev) => {
          if (!prev) return prev;
          const newMedia = (prev.data.media || []).filter((m: any) => String(m.media_id) !== String(media_id));
          return {
            ...prev,
            data: {
              ...prev.data,
              media: newMedia,
            },
          };
        });

        Toast.show('Xoá ảnh thành công', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'green', opacity: 1, position: Toast.positions.BOTTOM });
        // refresh to ensure consistent state
        const refreshed = await getDiscussionAPI(discussion_id as string);
        if (refreshed && refreshed.status === 'success') setDiscussionDetail(refreshed);
      } else {
        const msg = (res as any)?.message ?? 'Không thể xoá ảnh';
        Toast.show(msg, { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      }
    } catch (err: any) {
      if (err?.response?.status === 403) {
        Toast.show('Bạn không có quyền thực hiện thao tác này', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      } else {
        Toast.show('Lỗi khi xoá ảnh', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const createComment = async () => {
    if (!discussion_id) return;
    if (!commentText.trim()) return Toast.show('Vui lòng nhập nội dung', { duration: Toast.durations.SHORT, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
    try {
      setIsProcessing(true);
      const res = await CreateCommentAPI(discussion_id as string, commentText.trim());
      if (res && (res as any).status === 'success') {
        Toast.show('Bình luận thành công', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'green', opacity: 1, position: Toast.positions.BOTTOM });
        setCommentText("");
        const refreshed = await getDiscussionAPI(discussion_id as string);
        if (refreshed && refreshed.status === 'success') setDiscussionDetail(refreshed);
      } else {
        const msg = (res as any)?.message ?? 'Không thể bình luận';
        Toast.show(msg, { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      }
    } catch (err: any) {
      Toast.show('Lỗi khi gửi bình luận', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
    } finally {
      setIsProcessing(false);
    }
  };

  const replyComment = async (parent_comment_id: string, content: string): Promise<boolean> => {
    if (!discussion_id) return false;
    if (!content.trim()) return false;
    try {
      setIsProcessing(true);
      const res = await ReplyCommentAPI(discussion_id as string, content.trim(), parent_comment_id);
      if (res && (res as any).status === 'success') {
        const refreshed = await getDiscussionAPI(discussion_id as string);
        if (refreshed && refreshed.status === 'success') setDiscussionDetail(refreshed);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateComment = async (comment_id: string, content: string): Promise<boolean> => {
    if (!comment_id || !content.trim()) return false;
    try {
      setIsProcessing(true);
      const res = await UpdateCommentAPI(comment_id, content.trim());
      if (res && (res as any).status === 'success') {
        const refreshed = await getDiscussionAPI(discussion_id as string);
        if (refreshed && refreshed.status === 'success') setDiscussionDetail(refreshed);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteComment = async (comment_id: string): Promise<boolean> => {
    if (!comment_id) return false;
    try {
      setIsProcessing(true);
      const res = await DeleteCommentAPI(comment_id);
      if (res && (res as any).status === 'deleted') {
        const refreshed = await getDiscussionAPI(discussion_id as string);
        if (refreshed && refreshed.status === 'success') setDiscussionDetail(refreshed);
        return true;
      }
      return false;
    } catch (err: any) {
      if (err?.response?.status === 403) {
        Toast.show('Bạn không có quyền thực hiện thao tác này', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={30} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{`${forum_name} - ${course_code}`}</Text>

        <TouchableOpacity onPress={async () => {
          if (isEditing) {
            await saveEdit();
          } else {
            setIsEditing(true);
            setEditTitle(discussionDetail?.data.title || "");
            setEditContent(discussionDetail?.data.content || "");
          }
        }}>
          <Feather name={isEditing ? "check" : "more-horizontal"} size={22} color="#000" />
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

          {isEditing ? (
            <>
              <TextInput value={editTitle} onChangeText={setEditTitle} style={styles.editTitleInput} editable={!isProcessing} />
              <TextInput value={editContent} onChangeText={setEditContent} style={styles.editContentInput} editable={!isProcessing} multiline />

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <TouchableOpacity onPress={pickAndUploadImage} disabled={isProcessing}>
                  <Text style={{ color: '#007ACC' }}>Thêm ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setIsEditing(false); setEditTitle(discussionDetail?.data.title || ''); setEditContent(discussionDetail?.data.content || ''); }} disabled={isProcessing}>
                  <Text style={{ color: '#777' }}>Huỷ</Text>
                </TouchableOpacity>
              </View>

              {discussionDetail?.data.media && discussionDetail.data.media.length > 0 && (
                <View style={styles.mediaRow}>
                  {discussionDetail.data.media.map((m: any) => (
                    <View key={m.media_id} style={{ position: 'relative', marginRight: 8 }}>
                      <Image source={{ uri: m.image_url || m.url }} style={styles.mediaThumb} />
                      <TouchableOpacity style={styles.deleteImageBtn} onPress={() => handleDeleteImage(m.media_id)}>
                        <Feather name="x" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            <>
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
            </>
          )}

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

        {discussionDetail?.data.comment && discussionDetail.data.comment.map((comment) => (
          <CommentItem
            key={comment.comment_id}
            comment={comment}
            onReply={replyComment}
            onUpdate={updateComment}
            onDelete={deleteComment}
          />
        ))}
      </ScrollView>

      {/* INPUT COMMENT */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Viết bình luận..."
          style={styles.input}
          value={commentText}
          onChangeText={setCommentText}
          editable={!isProcessing}
        />
        <TouchableOpacity onPress={createComment} disabled={isProcessing || !commentText.trim()}>
          <Feather name="send" size={20} color={commentText.trim() ? "#007ACC" : "#ccc"} />
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
  editTitleInput: { borderWidth: 1, borderColor: '#eee', padding: 8, borderRadius: 6, marginTop: 8, fontWeight: '700' },
  editContentInput: { borderWidth: 1, borderColor: '#eee', padding: 8, borderRadius: 6, marginTop: 8, height: 120, textAlignVertical: 'top' },
  mediaRow: { flexDirection: 'row', marginTop: 8 },
  mediaThumb: { width: 80, height: 80, borderRadius: 8 },
  deleteImageBtn: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', padding: 4, borderRadius: 12 },

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
