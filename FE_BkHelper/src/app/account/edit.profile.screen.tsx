import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { APP_COLOR } from '@/utils/constant';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [form, setForm] = useState({
        name: 'Albert Florest',
        username: 'albertflorest_',
        gender: 'Male',
        phone: '+44 1632 960860',
        email: 'albertflorest@email.com',
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} value={form.name} />

                <Text style={styles.label}>Username</Text>
                <TextInput style={styles.input} value={form.username} />

                <Text style={styles.label}>Gender</Text>
                <TextInput style={styles.input} value={form.gender} />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input} value={form.phone} />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={form.email} />

                <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    form: {
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    saveBtn: {
        backgroundColor: APP_COLOR.BLUE,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
