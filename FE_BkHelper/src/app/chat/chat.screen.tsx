import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

export default function ChatScreen() {
  const { title } = useLocalSearchParams();
  const navigation = useNavigation();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Jhon abraham",
      sender: "me",
      time: "09:25 AM",
    },
    {
      id: "2",
      text: "Hello! Nazrul How are you?",
      sender: "other",
      time: "09:25 AM",
    },
    {
      id: "3",
      text: "You did your job well",
      sender: "me",
      time: "09:25 AM",
    },
    {
      id: "4",
      text: "Have a great working week!!",
      sender: "other",
      time: "09:25 AM",
    },
    {
      id: "5",
      text: "Hope you like it",
      sender: "other",
      time: "09:25 AM",
    },
  ]);

  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        text,
        sender: "me",
        time: "09:26 AM",
      },
    ]);
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

          <Text style={styles.headerTitle}>{title ?? "CO3005 - L05"}</Text>

          <View style={{ width: 22 }} />
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

  /* Header */
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

  /* Message */
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
