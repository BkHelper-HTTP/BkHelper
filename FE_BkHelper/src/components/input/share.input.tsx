import { APP_COLOR } from "@/utils/constant";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";

const styles = StyleSheet.create({
    InputGroup: {
        padding: 5,
        gap: 10
    },
    InputText: {
        fontSize: 18,

    },
    Input: {
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10
    },
    eye: {
        position: "absolute",
        right: 10,
        top: 18
    }
})

interface IProps {
    title?: string;
    keyboardType?: KeyboardTypeOptions,
    secureTextEntry?: boolean,
    value: any,
    setValue?: (v: any) => void,
    onChangeText?: any,
    onBlur?: any,
    error?: any
}

const ShareInput = (props: IProps) => {
    const { title, keyboardType, secureTextEntry = false,
        value, setValue, onChangeText, onBlur, error
    } = props
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    return (
        <View style={styles.InputGroup} >
            <Text style={styles.InputText}>{title}</Text>
            <View>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocus(true)}
                    onBlur={(e) => {
                        if (onBlur) {
                            onBlur(e)
                        }
                        setIsFocus(false)
                    }}
                    keyboardType={keyboardType}
                    style={[styles.Input,
                    { borderColor: isFocus ? APP_COLOR.BLUE : APP_COLOR.GREY }
                    ]}
                    secureTextEntry={secureTextEntry && !isShowPassword}
                />
                {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}
                {secureTextEntry &&
                    <FontAwesome5
                        style={styles.eye}
                        name={isShowPassword ? "eye" : "eye-slash"} size={15} color="black"
                        onPress={() => setIsShowPassword(!isShowPassword)}
                    />
                }
            </View>
        </View >
    )
}

export default ShareInput