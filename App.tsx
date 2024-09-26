import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Soup', course: 'Starter', price: 50, image: 'https://i.pinimg.com/236x/fc/3d/d8/fc3dd8e101ee74115f0377a58e88ff6b.jpg' },
    { id: 2, name: 'Steak', course: 'Main', price: 150, image: 'https://i.pinimg.com/236x/f9/b9/06/f9b906998ea72e8d544be321fd8046c2.jpg' },
    { id: 3, name: 'Salad', course: 'Starter', price: 60, image: 'https://i.pinimg.com/236x/45/73/d9/4573d97e97a507d2eadbe34261ad0b62.jpg' },
    { id: 4, name: 'Ice Cream', course: 'Dessert', price: 40, image: 'https://i.pinimg.com/564x/a9/b8/a2/a9b8a266a4c061ca6ab6af63cf2e7caa.jpg'},

  ]);

  const addMenuItem = (newItem) => {
    setMenuItems([...menuItems, { ...newItem, id: menuItems.length + 1 }]);
  };

  const removeMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
        <Stack.Screen name="Menu">
          {(props) => <MenuScreen {...props} menuItems={menuItems} addMenuItem={addMenuItem} removeMenuItem={removeMenuItem} />}
        </Stack.Screen>
        <Stack.Screen name="Filter">
          {(props) => <FilterScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation, menuItems }) => {
  const calculateAveragePrice = (course) => {
    const filteredItems = menuItems.filter(item => item.course === course);
    if (filteredItems.length === 0) return 0;
    const totalPrice = filteredItems.reduce((sum, item) => sum + item.price, 0);
    return (totalPrice / filteredItems.length).toFixed(2);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Menu Overview</Text>
      <Text style={styles.text}>Starter Average Price: ${calculateAveragePrice('Starter')}</Text>
      <Text style={styles.text}>Main Course Average Price: ${calculateAveragePrice('Main')}</Text>
      <Text style={styles.text}>Dessert Average Price: ${calculateAveragePrice('Dessert')}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu')}>
        <Text style={styles.buttonText}>Go to Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Filter')}>
        <Text style={styles.buttonText}>Filter Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const MenuScreen = ({ menuItems, addMenuItem, removeMenuItem }) => {
  const [newItem, setNewItem] = useState({ name: '', course: '', price: '', image: '' });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Add New Menu Item</Text>
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={newItem.name}
        onChangeText={(text) => setNewItem({ ...newItem, name: text })}
      />
      <TextInput
        placeholder="Course"
        style={styles.input}
        value={newItem.course}
        onChangeText={(text) => setNewItem({ ...newItem, course: text })}
      />
      <TextInput
        placeholder="Price"
        style={styles.input}
        value={newItem.price}
        onChangeText={(text) => setNewItem({ ...newItem, price: text })}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Image URL"
        style={styles.input}
        value={newItem.image}
        onChangeText={(text) => setNewItem({ ...newItem, image: text })}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (newItem.name && newItem.course && newItem.price && newItem.image) {
            addMenuItem(newItem);
            setNewItem({ name: '', course: '', price: '', image: '' }); // Reset input
          }
        }}
      >
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.text}>{item.name} - {item.course} - ${item.price}</Text>
              <TouchableOpacity style={styles.buttonSmall} onPress={() => removeMenuItem(item.id)}>
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
};

const FilterScreen = ({ menuItems }) => {
  const [filter, setFilter] = useState('All');

  const filteredItems = menuItems.filter(item => filter === 'All' || item.course === filter);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Filter Menu by Course</Text>
      <TouchableOpacity style={styles.button} onPress={() => setFilter('All')}>
        <Text style={styles.buttonText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setFilter('Starter')}>
        <Text style={styles.buttonText}>Starter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setFilter('Main')}>
        <Text style={styles.buttonText}>Main</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setFilter('Dessert')}>
        <Text style={styles.buttonText}>Dessert</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.text}>{item.name} - {item.course} - ${item.price}</Text>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSmall: {
    backgroundColor: '#FF4D4D',
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 150,
  },
});

export default App;
