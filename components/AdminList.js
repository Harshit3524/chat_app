import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AdminList = ({ admins, onSelectAdmin }) => {
    return (
        <View style={styles.container}>
          {admins.map(admin => (
             <TouchableOpacity key={admin.id} onPress={() => onSelectAdmin(admin)} style={styles.adminItem}>
               <Text style={styles.adminName}>{admin.name}</Text>
             </TouchableOpacity>
           ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0'
    },
    adminItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    adminName: {
      fontSize: 16,
    }
});

export default AdminList;
