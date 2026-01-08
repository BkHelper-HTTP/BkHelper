import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { io, Socket } from "socket.io-client";
import { JoinRoomAPI, getChatMessagesAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  senderId?: string;
  avatarUrl?: string | null;
}


export default function ChatScreen() {
  const { classId, className } = useLocalSearchParams();
  const navigation = useNavigation();

  // current user state (populated from JoinRoomAPI)
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const currentUserIdRef = useRef<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("disconnected");
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const [myAvatar, setMyAvatar] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const socketRef = useRef<Socket | null>(null);

  const formatTime = (epochSeconds?: number) => {
    if (!epochSeconds) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const d = new Date(epochSeconds * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    const baseURL = process.env.EXPO_PUBLIC_CHAT_URL;

    const socket = io(baseURL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connected');
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
    });

    socket.on("newMessage", (data: any) => {
      const senderId = data.senderId ?? data.sender?.id ?? "";
      const avatarUrl = data.sender?.avatarUrl ?? data.avatarUrl ?? null;
      const msg: Message = {
        id: String(data.id ?? data._id ?? Date.now()),
        text: data.content,
        sender: (senderId === currentUserIdRef.current || senderId === "me") ? "me" : "other",
        senderId,
        avatarUrl,
        time: formatTime(
          data.createdAt
            ? new Date(data.createdAt).getTime() / 1000
            : undefined
        ),
      };

      setMessages((prev) => {
        const exists = prev.some(p => p.id === msg.id || (msg.sender === 'me' && p.sender === 'me' && p.text === msg.text));
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    socket.on('connect_error', (err: any) => {
      setStatus('error');
      Alert.alert('WebSocket connect error', err?.message ?? JSON.stringify(err));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    }
  }, []);

  const joinRoom = async (classId?: string, className?: string) => {
    if (!classId) return;

    try {
      const res = await JoinRoomAPI(classId, className!);
      console.log('>>> JoinRoomAPI res:', res);
      const roomId = res.roomId;

      try {
        const userFromRes = res?.user;
        if (userFromRes) {
          const userId = userFromRes.id;
          const userName = userFromRes.name;
          const avatar = userFromRes.avatarUrl ?? null;

          setCurrentUserId(userId);
          currentUserIdRef.current = userId;
          setCurrentUserName(userName);
          setMyAvatar(avatar);
        }
      } catch (e) { /* ignore */ }

      const socket = socketRef.current;
      if (!socket) return;

      // 1️⃣ Join socket room
      socket.emit("joinRoom", roomId);
      setJoinedRoom(roomId);

      // 2️⃣ Fetch history bằng ROOM ID (KHÔNG phải classId)
      const hist = await getChatMessagesAPI(roomId);
      console.log('>>> getChatMessagesAPI hist:', hist);

      const safeTime = (x: any) => {
        const t = x ? new Date(x).getTime() : 0;
        return isNaN(t) ? 0 : t;
      };

      // sort history so oldest messages come first, newest last (so newest appears at the bottom)
      const ordered = (hist ?? []).slice().sort((a: any, b: any) => safeTime(a.createdAt) - safeTime(b.createdAt));

      const mapped: Message[] = ordered.map((m: any) => {
        const senderId = m.senderId ?? m.sender?.id ?? "";
        const avatarUrl = m.sender?.avatarUrl ?? m.avatarUrl ?? null;
        const isMe = senderId === currentUserIdRef.current;

        return {
          id: String(m.id ?? m._id),
          text: m.content,
          sender: isMe ? "me" : "other",
          senderId,
          avatarUrl,
          time: formatTime(
            m.createdAt
              ? new Date(m.createdAt).getTime() / 1000
              : undefined
          ),
        } as Message;
      });

      setMessages(mapped);
    } catch (err: any) {
      Alert.alert("Join room failed", err?.message ?? "Unknown error");
    }
  };

  const sendMessage = () => {
    if (!text.trim() || !joinedRoom || !currentUserId) return;

    const content = text.trim();

    // optimistic UI: append locally
    const optimisticMsg: Message = {
      id: String(Date.now()),
      text: content,
      sender: "me",
      senderId: currentUserId,
      avatarUrl: myAvatar ?? null,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    socketRef.current?.emit("sendMessage", {
      roomId: joinedRoom,
      senderId: currentUserId,
      senderName: currentUserName || "me",
      msgType: 'text',
      content: content,
    });

    setText("");
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";

    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        {!isMe && (
          <Image
            source={item.avatarUrl ? { uri: item.avatarUrl } : { uri: "https://i.pravatar.cc/40" }}
            style={styles.avatar}
          />
        )}

        <View
          style={[
            styles.bubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text style={isMe ? styles.messageText : styles.messageTextOther}>{item.text}</Text>
          <Text style={isMe ? styles.timeText : styles.timeTextOther}>{item.time}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (status === "connected" && classId) {
      joinRoom(String(classId), String(className));
    }
  }, [status]);

  // when messages change, scroll to bottom to show the latest message
  useEffect(() => {
    try {
      // FlatList doesn't type narrow scrollToEnd, so use any
      (flatListRef.current as any)?.scrollToEnd?.({ animated: true });
    } catch (e) { /* ignore */ }
  }, [messages]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#000" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.headerTitle}>
              {className}
            </Text>
            <View
              style={[
                styles.statusDot,
                status === "connected" ? styles.online : styles.offline,
              ]}
            />
          </View>

          <View style={{ width: "auto" }} />
        </View>

        {/* Chat */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Write your message"
            value={text}
            onChangeText={setText}
          />

          <TouchableOpacity onPress={sendMessage}>
            <Feather name="send" size={22} color={APP_COLOR.BLUE} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  messageRow: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 14,
  },
  myBubble: {
    backgroundColor: "#00A884",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#F1F1F1",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: "#ffffff",
    fontSize: 14,
  },
  messageTextOther: {
    color: "#000000",
    fontSize: 14,
  },
  timeText: {
    fontSize: 10,
    color: "#ffffff",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  timeTextOther: {
    fontSize: 10,
    color: "#000000",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: 6,
  },
  online: { backgroundColor: "#00A884" },
  offline: { backgroundColor: "#999" },
});
