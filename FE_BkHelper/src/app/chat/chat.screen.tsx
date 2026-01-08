import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { io, Socket } from "socket.io-client";
import { JoinRoomAPI, getChatMessagesAPI } from "@/utils/api";
import { instanceChat } from "@/utils/axios.customize";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

export default function ChatScreen() {
  const { classId, className } = useLocalSearchParams();
  const navigation = useNavigation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("disconnected");
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // Helper to format epoch -> hh:mm AM/PM
  const formatTime = (epochSeconds?: number) => {
    if (!epochSeconds) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const d = new Date(epochSeconds * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    // Use base URL from axios instance so we don't hardcode `localhost` (helps when testing on device/emulator)
    const baseURL = (instanceChat && instanceChat.defaults && instanceChat.defaults.baseURL) ? instanceChat.defaults.baseURL : 'http://localhost:3000';

    const socket = io(baseURL, {
      transports: ['websocket'],
      // If your server requires a custom path or auth, add here (e.g. path: '/ws')
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connected');
      console.log('socket connected', socket.id);
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
      console.log('socket disconnected');
    });

    // `newMessage` event from server
    socket.on('newMessage', (data: any) => {
      // Normalize incoming message to Message
      const msg: Message = {
        id: String(data.id ?? Date.now()),
        text: data.text ?? data.content ?? JSON.stringify(data),
        sender: 'other',
        time: formatTime(data.timecreated ?? data.timestamp),
      };
      setMessages(prev => [...prev, msg]);
    });

    socket.on('connect_error', (err: any) => {
      setStatus('error');
      console.warn('connect_error', err);
      Alert.alert('WebSocket connect error', err?.message ?? JSON.stringify(err));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    }
  }, []);

  const joinRoom = async (classId?: string, className?: string) => {
    const cid = classId;
    if (!cid) return Alert.alert('Missing class id');

    try {
      // Call API to create or get the room
      const res = await JoinRoomAPI(classId, className!);
      // try to read room id from response (different backends use different fields)
      const roomId = res?.id;

      // emit joinRoom via socket
      const socket = socketRef.current;
      if (!socket) return Alert.alert('Socket not ready');

      socket.emit('joinRoom', roomId);
      setJoinedRoom(roomId);

      // fetch history messages
      const hist = await getChatMessagesAPI(String(cid));
      const arr = hist;

      // map backend messages to UI messages
      const mapped: Message[] = (Array.isArray(arr) ? arr : []).map((m: any) => ({
        id: String(m.id ?? m._id ?? Date.now()),
        text: m.text ?? m.content ?? '',
        sender: 'other',
        time: formatTime(m.timecreated ?? m.timestamp),
      }));

      setMessages(mapped);

    } catch (err: any) {
      console.error('joinRoom error', err);
      let message = err?.message ?? 'Unknown error';
      if (err?.response) {
        message = `Request failed: ${err.response.status} ${JSON.stringify(err.response.data)}`;
      } else if (err?.request) {
        message = 'No response from server (network error / CORS) — check server URL and your device network';
      }
      Alert.alert('Failed to join room', message);
    }
  }

  const sendMessage = () => {
    if (!text.trim()) return;
    const socket = socketRef.current;
    if (!socket) return Alert.alert('Socket not connected');
    if (!joinedRoom) return Alert.alert('You must join a room first');

    // You should pass real senderId and senderName from auth/user context
    const payload = {
      roomId: joinedRoom,
      senderId: 'me',
      senderName: 'Me',
      msgType: 'text',
      content: text,
    };

    socket.emit('sendMessage', payload);

    // append locally
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        sender: 'me',
        time: formatTime(),
      }
    ]);

    setText('');
  }

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
            source={{ uri: "https://i.pravatar.cc/40" }}
            style={styles.avatar}
          />
        )}

        <View
          style={[
            styles.bubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{className ?? "CO3005 - L05"}</Text>

          <View style={{ width: 22 }} />
        </View>

        <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
          <Text>Status: {status} {joinedRoom ? `· Room: ${joinedRoom}` : ''}</Text>

          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TouchableOpacity onPress={() => joinRoom(String(classId ?? ''), String(className ?? ''))} style={{ marginRight: 8 }}>
              <Text style={{ color: '#00A884' }}>Join Room</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setMessages([]); }}>
              <Text style={{ color: '#666' }}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat */}
        <FlatList
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

          <TouchableOpacity>
            <Feather name="camera" size={22} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginHorizontal: 8 }}>
            <Feather name="mic" size={22} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity onPress={sendMessage}>
            <Feather name="send" size={22} color="#00A884" />
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
    color: "#000",
    fontSize: 14,
  },
  timeText: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  /* Input */
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
});
