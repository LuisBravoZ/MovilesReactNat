// components/Sidebar.js
import * as React from 'react';
import { View } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { Drawer, IconButton } from 'react-native-paper';
import { Platform } from 'react-native';


const Sidebar = ({ navigation, visible, onClose, items, style }) => {
    if (Platform.OS !== 'web' || !visible) return null;

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={style.drawerContainer}
            >
                <Drawer.Section>
                    {items.map((item, index) => (
                        <Drawer.Item
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            onPress={() => {
                                onClose(); 
                                if (item.navigateTo) {
                                    navigation.navigate(item.navigateTo);
                                } else if (item.onPress) {
                                    item.onPress();
                                }
                            }}
                        />
                    ))}
                </Drawer.Section>
                <IconButton
                    icon="close"
                    size={24}
                    style={{ position: 'absolute', top: 10, right: 10 }}
                    onPress={onClose}
                />
            </Modal>
        </Portal>
    );
};

export default Sidebar;
