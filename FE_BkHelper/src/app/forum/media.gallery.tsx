import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface IProps {
    media: IMediaDiscussion[] | null;
}

const MediaGallery = ({ media }: IProps) => {
    const [viewerVisible, setViewerVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!media || media.length === 0) return null;

    const openViewer = (index: number) => {
        setCurrentIndex(index);
        setViewerVisible(true);
    };

    return (
        <>
            {/* ===== THUMBNAILS ===== */}
            {media.length === 1 ? (
                <TouchableOpacity activeOpacity={0.9} onPress={() => openViewer(0)}>
                    <Image
                        source={{ uri: media[0].image_url }}
                        style={styles.singleImage}
                    />
                </TouchableOpacity>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.imageList}
                >
                    {media.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            onPress={() => openViewer(index)}
                        >
                            <Image
                                source={{ uri: item.image_url }}
                                style={styles.multiImage}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* ===== FULL SCREEN VIEWER ===== */}
            <Modal
                visible={viewerVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setViewerVisible(false)}
            >
                <View style={styles.viewerContainer}>
                    {/* Close */}
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setViewerVisible(false)}
                    >
                        <Feather name="x" size={28} color="#fff" />
                    </TouchableOpacity>

                    {/* Images */}
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentOffset={{ x: width * currentIndex, y: 0 }}
                    >
                        {media.map((item, index) => (
                            <View key={index} style={styles.viewerImageWrapper}>
                                <Image
                                    source={{ uri: item.image_url }}
                                    style={styles.viewerImage}
                                    resizeMode="contain"
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
};

export default MediaGallery;

const styles = StyleSheet.create({
    singleImage: {
        width: "100%",
        height: width * 0.7,
        borderRadius: 12,
        marginTop: 10,
    },

    imageList: {
        marginTop: 10,
    },

    multiImage: {
        width: width * 0.65,
        height: width * 0.65,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: "#eee",
    },

    /* FULL SCREEN */
    viewerContainer: {
        flex: 1,
        backgroundColor: "#000",
    },
    closeBtn: {
        position: "absolute",
        top: 50,
        right: 20,
        zIndex: 10,
    },
    viewerImageWrapper: {
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
    },
    viewerImage: {
        width: "100%",
        height: "100%",
    },
});
