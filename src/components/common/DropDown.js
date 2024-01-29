import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from
    '../../../pixel';
import { ScrollView } from 'react-native-gesture-handler';

const Dropdown = ({ options, onSelect }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSelect = (option) => {
        setShowDropdown(false);
        onSelect(option);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.header}>
                <Text>{options.find((opt) => opt.selected)?.label || 'Select an option'}</Text>
            </TouchableOpacity>

            {showDropdown && (
                <View style={styles.dropdownContainer}>
                    <FlatList
                        data={options}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.option}>
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.value.toString()}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    header: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    dropdownContainer: {
        maxHeight: hp(14), // Set the maximum height for the dropdown container
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        maxHeight: 150, // Set the maximum height for the dropdown options
    },
    option: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopWidth: 0,
        borderRadius: 5,
    },
});


export default Dropdown;
