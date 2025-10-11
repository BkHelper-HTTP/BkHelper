import ShareButton from "@/components/button/share.button"
import SocialButton from "@/components/button/social.button"
import ShareInput from "@/components/input/share.input"
import { APP_COLOR } from "@/utils/constant"
import { LoginSchema } from "@/utils/validate.schema"
import { Link, router } from "expo-router"; import { Formik } from 'formik'
import { useState } from "react"
import { ImageBackground, Platform, StyleSheet, Text, View } from "react-native"
// import { useCurrentApp } from "@/context/app.context"
import login from "@/assets/auth/loginBackground.jpg"
import { lmsLoginAPI } from "@/utils/api"
import Toast from "react-native-root-toast";

const styles = StyleSheet.create({
    container: { flex: 0.8, marginHorizontal: 20, gap: 10 },
});

const backend =
    Platform.OS === "android"
        ? process.env.EXPO_PUBLIC_ANDROID_API_URL
        : process.env.EXPO_PUBLIC_IOS_API_URL;

const SignInPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async (username: string, password: string) => {
        console.log("check backend: ", backend)
        try {
            setIsLoading(true);
            const res = await lmsLoginAPI(username, password);
            console.log("check res: ", res)
            console.log("check backend: ", backend)
            if (res.data) {
                // setAppState(res.data);
                // await AsyncStorage.setItem("access_token", res.data.access_token)
                router.replace({ pathname: "/(tabs)" });
            } else {
                // const m = Array.isArray(res.message) ? res.message[0] : res.message;
                // Toast.show(m, {
                //     duration: Toast.durations.LONG,
                //     textColor: "white",
                //     backgroundColor: APP_COLOR.BLUE,
                //     opacity: 1,
                // });

                // if (res.statusCode === 400) {
                //     router.replace({
                //         pathname: "/(auth)/verify",
                //         params: { email: email, isLogin: 1 },
                //     });
                // }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* <View> */}
            <ImageBackground
                style={{ flex: 0.2, height: 220, width: "auto", borderWidth: 1, borderColor: "red" }}
                source={login}
            />
            {/* </View> */}
            <View style={styles.container}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
                    <Text
                        style={{
                            fontSize: 36,
                            fontWeight: "bold",
                        }}
                    >
                        Welcome
                    </Text>
                    <Text
                        style={{
                            fontSize: 36,
                            fontWeight: "200",
                        }}
                    > back !</Text>
                </View>
                <Formik
                    validationSchema={LoginSchema}
                    initialValues={{ username: '', password: '' }}
                    onSubmit={(values) => handleLogin(values.username, values.password)}
                // onSubmit={() => alert("me")}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                            <ShareInput
                                title="Username"
                                // keyboardType="email-address"
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                                error={errors.username}
                            />
                            <ShareInput
                                title="Password"
                                secureTextEntry={true}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                error={errors.password}
                            />

                            <View
                                style={{
                                    marginVertical: 15,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                }}
                            >
                                <Link href={"/"}>
                                    <Text style={{ fontWeight: "700", color: APP_COLOR.BLUE }}>
                                        Forgot password?
                                    </Text>
                                </Link>
                            </View>

                            <ShareButton
                                title="Login"
                                onPress={handleSubmit}
                                textStyle={{ color: "#fff", fontSize: 19 }}
                                buttonStyle={{
                                    justifyContent: "center",
                                    borderRadius: 30,
                                    backgroundColor: APP_COLOR.BLUE,
                                    paddingVertical: 15,
                                }}
                                pressStyle={{ alignSelf: "stretch" }}
                                loading={isLoading}
                            />

                            <View style={{
                                marginVertical: 15,
                                flexDirection: "row",
                                gap: 10,
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    textAlign: "center",
                                    color: "black"
                                }}>
                                    Chưa có tài khoản
                                </Text>
                                <Link href={"/(auth)/signup"}>
                                    <Text style={{
                                        textAlign: "center",
                                        color: "black",
                                        textDecorationLine: "underline"
                                    }}>
                                        Đăng ký.
                                    </Text>
                                </Link>
                            </View>
                            <SocialButton title="Sign up with" textColor="black" />
                        </>
                    )}
                </Formik>
            </View>
        </>
    );

}

export default SignInPage
