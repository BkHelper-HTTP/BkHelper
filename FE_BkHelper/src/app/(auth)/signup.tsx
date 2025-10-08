import login from "@/assets/auth/loginBackground.jpg"
import ShareButton from "@/components/button/share.button"
import SocialButton from "@/components/button/social.button"
import ShareInput from "@/components/input/share.input"
import { APP_COLOR } from "@/utils/constant"
import { SignUpSchema } from "@/utils/validate.schema"
import { Link } from "expo-router"
import { Formik } from "formik"
import { useState } from "react"
import { ImageBackground, StyleSheet, Text, View } from "react-native"


const styles = StyleSheet.create({
    contanier: {
        flex: 0.8,
        gap: 10,
        marginHorizontal: 20
    },

})

const SignUpPage = () => {
    const [loading, setLoading] = useState<boolean>(false);


    return (
        <Formik
            validationSchema={SignUpSchema}
            initialValues={{ email: '', password: '', name: '' }}
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
                    <View style={styles.contanier}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
                            <Text
                                style={{
                                    fontSize: 36,
                                    fontWeight: "bold",
                                }}
                            >
                                Sign
                            </Text>
                            <Text
                                style={{
                                    fontSize: 36,
                                    fontWeight: "200",
                                }}
                            > Up !</Text>
                        </View>

                        <ShareInput
                            title="Name"
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                            error={errors.name}
                        />

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

                        <ShareButton
                            loading={loading}
                            title="Đăng Ký"
                            onPress={handleSubmit}
                            textStyle={{
                                textTransform: "uppercase",
                                color: "#fff",
                                paddingVertical: 5
                            }}
                            buttonStyle={{
                                justifyContent: "center",
                                borderRadius: 30,
                                marginHorizontal: 50,
                                paddingHorizontal: 10,
                                backgroundColor: APP_COLOR.BLUE,
                            }}
                            pressStyle={{ alignSelf: "stretch" }}
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
                                Đã có tài khoản
                            </Text>
                            <Link href={"/(auth)/signin"}>
                                <Text style={{
                                    textAlign: "center",
                                    color: "black",
                                    textDecorationLine: "underline"
                                }}>
                                    Đăng nhập.
                                </Text>
                            </Link>
                        </View>

                        <SocialButton title="Sign in with" textColor="black" />
                    </View>
                </>
            )}
        </Formik>
    )
}

export default SignUpPage