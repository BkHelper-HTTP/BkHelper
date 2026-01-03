import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

const ForumAddScreen = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { forum_name, course_code } = useLocalSearchParams()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="x" size={30} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    {`${forum_name} - ${course_code}`}
                </Text>

                <TouchableOpacity>
                    <Feather name="send" size={20} color="#007ACC" />
                </TouchableOpacity>
            </View>

            {/* FORM */}
            <View style={styles.container}>
                {/* Topic */}
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="Chủ đề ..."
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Feather name="edit-2" size={16} color="#777" />
                </View>

                {/* Image */}
                <TouchableOpacity style={styles.imageRow}>
                    <Feather name="image" size={20} color="#000" />
                </TouchableOpacity>

                {/* Content */}
                <View style={[styles.inputRow, styles.textAreaRow]}>
                    <TextInput
                        placeholder="Nội dung ..."
                        style={[styles.input, styles.textArea]}
                        multiline
                        value={content}
                        onChangeText={setContent}
                    />
                    <Feather name="edit-2" size={16} color="#777" />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ForumAddScreen;


const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
        justifyContent: "space-between",
    },
    headerTitle: {
        width: 300,
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center"
    },

    container: {
        padding: 16,
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#eee",
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingRight: 8,
    },

    imageRow: {
        paddingVertical: 14,
    },

    textAreaRow: {
        alignItems: "flex-start",
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: "top",
    },
});
