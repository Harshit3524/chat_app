import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Drawer from 'react-native-drawer';
import AdminList from './components/AdminList';
import UserPanel from './components/UserPanel';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://localhost:8081';

const App = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [messages, setMessages] = useState({});
    const [socket, setSocket] = useState(null);
    const admins = [
        { id: 'admin1', name: 'Harshit' },
        { id: 'admin2', name: 'Kishore' },
        { id: 'admin3', name: 'Ram' },
    ];
    const socketRef = useRef();

    useEffect(() => {
        
        socketRef.current = io(SOCKET_URL);
        setSocket(socketRef.current);

        const loadMessages = async () => {
            try {
                const storedMessages = await AsyncStorage.getItem('chatMessages');
                if (storedMessages) {
                    setMessages(JSON.parse(storedMessages));
                }
            } catch (error) {
                console.error("Failed to load messages:", error);
            }
        };

        loadMessages();

        socketRef.current.on('chat message', (message) => {
            setMessages((prevMessages) => {
                const newMessages = { ...prevMessages };
                const chatKey = getChatKey(message.from, message.to);

                if (!newMessages[chatKey]) {
                    newMessages[chatKey] = [message];
                } else {
                    newMessages[chatKey] = [...newMessages[chatKey], message];
                }

                AsyncStorage.setItem('chatMessages', JSON.stringify(newMessages));
                return newMessages;

            });
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const onSelectAdmin = (admin) => {
        setSelectedAdmin(admin.id);
        setDrawerOpen(false);
    };

    const sendMessage = (fromAdmin, toAdmin, messageText) => {
      if (!socketRef.current) return;

      const newMessage = {
          from: fromAdmin,
          to: toAdmin,
          text: messageText,
          timestamp: Date.now()
      };

      const chatKey = getChatKey(fromAdmin, toAdmin);

      setMessages(prevMessages => {
          const updatedMessages = {
              ...prevMessages,
              [chatKey]: [...(prevMessages[chatKey] || []), newMessage]
          };
          AsyncStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
          socketRef.current?.emit('chat message', newMessage); // send via socket
          return updatedMessages;
      });
  };

    const getChatKey = (admin1, admin2) => {
        const sortedAdmins = [admin1, admin2].sort();
        return `${sortedAdmins[0]}-${sortedAdmins[1]}`;
    };

    const renderDrawer = () => (
        <AdminList admins={admins} onSelectAdmin={onSelectAdmin} />
    );

    return (
        <Drawer
            open={drawerOpen}
            content={renderDrawer()}
            tapToClose={true}
            openDrawerOffset={0.2}
            panCloseMask={0.2}
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={toggleDrawer} style={styles.hamburger}>
                    <Text>☰</Text>
                </TouchableOpacity>

                {selectedAdmin ? (
                    <UserPanel
                        currentAdmin={selectedAdmin}
                        admins={admins.filter((admin) => admin.id !== selectedAdmin)}
                        messages={messages}
                        sendMessage={sendMessage}
                        getChatKey={getChatKey}
                    />
                ) : (
                    <Text style={styles.welcomeText}>Select an admin to start chatting</Text>
                )}
            </View>
        </Drawer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    hamburger: {
        fontSize: 30,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    welcomeText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50
    }
});

export default App;
