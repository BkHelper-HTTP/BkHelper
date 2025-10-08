import ShareButton from "@/components/button/share.button"
import SocialButton from "@/components/button/social.button"
import ShareInput from "@/components/input/share.input"
import { APP_COLOR } from "@/utils/constant"
import { LoginSchema } from "@/utils/validate.schema"
import { Link } from "expo-router"
import { Formik } from 'formik'
import { useState } from "react"
import { ImageBackground, StyleSheet, Text, View } from "react-native"
// import { useCurrentApp } from "@/context/app.context"
import login from "@/assets/auth/loginBackground.jpg"

const styles = StyleSheet.create({
    container: { flex: 0.8, marginHorizontal: 20, gap: 10 },
});

const SignInPage = () => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Formik
            validationSchema={LoginSchema}
            initialValues={{ email: '', password: '' }}
            // onSubmit={(values) => handleLogin(values.email, values.password)}
            onSubmit={() => alert("me")}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
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

                        <ShareInput
                            title="Email"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            error={errors.email}
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
                            loading={loading}
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
                    </View>
                </>
            )}
        </Formik>
    );
}

export default SignInPage
