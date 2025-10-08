import { Text, View } from "react-native";

interface IProps {
    title: string;
    TextColor?: "white" | "black";
}
const TextBetweenLine = (props: IProps) => {
    const { title, TextColor = "white" } = props;
    return (
        <View style={{
            flexDirection: "row",
            gap: 15,
            justifyContent: "center",
        }}>
            <View style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                paddingHorizontal: 35,
            }}>
            </View>
            <Text style={{ color: TextColor, position: "relative", top: 10 }}>{title}</Text>
            <View style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                paddingHorizontal: 35,
            }}>
            </View>
        </View>
    )
}

export default TextBetweenLine