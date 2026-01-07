import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { CreateDiscussionAPI, UploadImageAPI } from "@/utils/api";
import Toast from "react-native-root-toast";

const ForumAddScreen = () => {
    const navigation = useNavigation();
    const { forum_id, forum_name, course_code } = useLocalSearchParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const uris = result.assets.map((a) => a.uri);
            setSelectedImages((prev) => {
                const next = [...prev];
                uris.forEach((u) => { if (!next.includes(u)) next.push(u); });
                return next;
            });
        }
    };

    const createDiscussion = async () => {
        if (!forum_id) throw new Error("Missing forum_id");
        const res = await CreateDiscussionAPI(forum_id as string, title, content);
        const id = (res as any)?.data?.discussion_id ?? (res as any)?.data?.id ?? (res as any)?.discussion_id ?? (res as any)?.id;
        if (id) return id;
        const discussionObj = (res as any)?.data?.discussion ?? (res as any)?.discussion;
        if (discussionObj?.id || discussionObj?.discussion_id) return discussionObj.id ?? discussionObj.discussion_id;
        throw new Error("Create discussion failed");
    };

    const uploadImg = async (discussionId: string, uri: string) => {
        const formData = new FormData();
        const filename = uri.split('/').pop() || `photo.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : 'image/jpeg';
        // React Native expects { uri, name, type }
        // @ts-ignore
        formData.append('file', { uri, name: filename, type });

        const res = await UploadImageAPI(formData, discussionId);
        return res;
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    }

    const resetData = () => {
        setTitle("")
        setContent("")
        setSelectedImages([])
    }

    const handleSubmit = async () => {
        if (!title.trim()) {
            Toast.show("Thiếu chủ đề! Vui lòng nhập chủ đề thảo luận", {
                duration: Toast.durations.LONG,
                textColor: "white",
                backgroundColor: "red",
                opacity: 1,
                position: Toast.positions.BOTTOM
            });
            return;
        }
        else if (!content.trim()) {
            Toast.show("Thiếu nội dung! Vui lòng nhập nội dung thảo luận", {
                duration: Toast.durations.LONG,
                textColor: "white",
                backgroundColor: "red",
                opacity: 1,
                position: Toast.positions.BOTTOM
            });
            return;
        }

        setIsSubmitting(true);
        const discussionId = await createDiscussion();
        if (selectedImages.length && discussionId) {
            for (const uri of selectedImages) {
                await uploadImg(String(discussionId), uri);
            }
        }
        Toast.show("Discussion is created successfully", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: "green",
            opacity: 1,
            position: Toast.positions.BOTTOM
        });
        resetData()
        navigation.goBack();
        setIsSubmitting(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    disabled={isSubmitting}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="x" size={28} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    {`${forum_name} - ${course_code}`}
                </Text>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#007ACC" />
                    ) : (
                        <Feather
                            name="send"
                            size={20}
                            color={content ? "#007ACC" : "#aaa"}
                        />
                    )}
                </TouchableOpacity>
            </View>

            {/* FORM */}
            <View style={styles.container}>
                {/* Title */}
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="Chủ đề ..."
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Feather name="edit-2" size={16} color="#777" />
                </View>

                {/* Image Picker */}
                <TouchableOpacity style={styles.imageRow} onPress={pickImage}>
                    <Feather name="image" size={20} color="#000" />
                    <Text style={{ marginLeft: 8 }}>
                        {selectedImages.length ? `${selectedImages.length} ảnh đã chọn` : "Thêm ảnh (tuỳ chọn)"}
                    </Text>
                </TouchableOpacity>

                {/* Preview Images */}
                {selectedImages.length > 0 && (
                    <View style={styles.previewList}>
                        {selectedImages.map((uri, idx) => (
                            <View key={uri} style={styles.previewItem}>
                                <Image source={{ uri }} style={styles.previewImageItem} />
                                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(idx)}>
                                    <Feather name="x" size={14} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

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
        textAlign: "center",
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
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
    },

    previewImage: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 12,
    },
    previewList: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    previewItem: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 8,
    },
    previewImageItem: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
    },

    textAreaRow: {
        alignItems: "flex-start",
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: "top",
    },
});
