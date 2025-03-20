import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const UserPanel = ({ currentAdmin, admins, messages, sendMessage, getChatKey }) => {
    const [messageText, setMessageText] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);

    const handleSend = () => {
        if (selectedContact) {
            sendMessage(currentAdmin, selectedContact.id, messageText);
            setMessageText('');
        }
    };

    const getInitials = (name) => {
        const nameParts = name.split(' ');
        let initials = '';
        for (let i = 0; i < Math.min(2, nameParts.length); i++) {
            initials += nameParts[i].charAt(0).toUpperCase();
        }
        return initials;
    };

    const renderContact = ({ item }) => (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => setSelectedContact(item)}
        >
            <View style={[styles.avatar, styles.nameAvatar]}>
                <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
            </View>
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderMessage = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>

            <FlatList
                data={admins}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                style={styles.contactList}
            />

            {selectedContact && (
                <View style={styles.chatContainer}>
                    <FlatList
                        data={messages[getChatKey(currentAdmin, selectedContact.id)] || []}
                        renderItem={renderMessage}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.messageList}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={messageText}
                            onChangeText={setMessageText}
                            placeholder="Type your message..."
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chatContainer: {
        marginBottom: 20,
    },
    contactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    nameAvatar: {
        backgroundColor: '#2196f3', // Customize
    },
    avatarText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatWithText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageList: {
        height: 150, // Adjust as needed
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#2196f3',
        padding: 10,
        borderRadius: 5,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
});

export default UserPanel;
