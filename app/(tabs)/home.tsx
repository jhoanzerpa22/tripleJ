import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'básicos', name: 'Básicos' },
  { id: 'vegetales', name: 'Vegetales' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'snacks', name: 'Snacks' },
];

const PRODUCTS = [
  {
    id: '1',
    name: 'Café Premium',
    price: 5.99,
    category: 'básicos',
    image: 'https://api.a0.dev/assets/image?text=premium%20coffee%20package%20on%20wooden%20table&aspect=1:1',
    description: 'Café de primera calidad, 500g'
  },
  {
    id: '2',
    name: 'Azúcar Refinada',
    price: 2.99,
    category: 'básicos',
    image: 'https://api.a0.dev/assets/image?text=white%20sugar%20in%20clear%20package&aspect=1:1',
    description: 'Azúcar blanca refinada, 1kg'
  },
  {
    id: '3',
    name: 'Aceite de Oliva',
    price: 8.99,
    category: 'básicos',
    image: 'https://api.a0.dev/assets/image?text=olive%20oil%20bottle%20with%20olives&aspect=1:1',
    description: 'Aceite de oliva extra virgen, 750ml'
  },
  {
    id: '4',
    name: 'Tomates Frescos',
    price: 3.99,
    category: 'vegetales',
    image: 'https://api.a0.dev/assets/image?text=fresh%20red%20tomatoes&aspect=1:1',
    description: 'Tomates frescos, 1kg'
  },
  {
    id: '5',
    name: 'Coca-Cola',
    price: 1.99,
    category: 'bebidas',
    image: 'https://api.a0.dev/assets/image?text=cold%20coca%20cola%20can&aspect=1:1',
    description: 'Refresco, 355ml'
  },
  {
    id: '6',
    name: 'Papas Fritas',
    price: 2.49,
    category: 'snacks',
    image: 'https://api.a0.dev/assets/image?text=crispy%20potato%20chips&aspect=1:1',
    description: 'Papas fritas crujientes, 150g'
  },
];

const App = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productQuantities, setProductQuantities] = useState([]);
  const [cartBounceValue] = useState(new Animated.Value(1));

  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(product => product.category === selectedCategory);

  const totalCartItems = cart.reduce((sum, item: any) => sum + item.quantity, 0);

  const updateProductQuantity = (productId: any, change: any) => {
    setProductQuantities((prev: any) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const addToCart = ({product}: any) => {
    const quantity = productQuantities[product.id] || 1;
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      /*setCart(cart.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));*/
    } else {
      //setCart([...cart, { ...product, quantity }]);
    }
    
    // Reset quantity after adding to cart
    setProductQuantities((prev: any) => ({
      ...prev,
      [product.id]: 0
    }));

    // Animate cart icon
    Animated.sequence([
      Animated.spring(cartBounceValue, {
        toValue: 1.2,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.spring(cartBounceValue, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const removeFromCart = (productId: any) => {
    setCart(cart.filter((item: any) => item.id !== productId));
  };

  const CategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
    >
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category.id && styles.categoryButtonTextActive
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProduct = ({ item }: any) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateProductQuantity(item.id, -1)}
          >
            <AntDesign name="minus" size={20} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>
            {productQuantities[item.id] || 0}
          </Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateProductQuantity(item.id, 1)}
          >
            <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.addButton,
          (!productQuantities[item.id] || productQuantities[item.id] === 0) && styles.addButtonDisabled
        ]}
        onPress={() => productQuantities[item.id] > 0 && addToCart(item)}
        disabled={!productQuantities[item.id] || productQuantities[item.id] === 0}
      >
        <MaterialIcons name="add-shopping-cart" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const HomeScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Productos Disponibles</Text>
      <CategoryFilter />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const CartScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Carrito de Compras</Text>
      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
          <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          renderItem={({ item }: any) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.cartItemImage} />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
                <Text style={styles.cartItemQuantity}>Cantidad: {item.quantity}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <MaterialIcons name="delete" size={24} color="#FF5252" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item: any) => item.id}
        />
      )}
      {cart.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total: ${cart.reduce((sum, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Realizar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const ProfileScreen = () => (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <MaterialIcons name="account-circle" size={80} color="#6200EE" />
        <Text style={styles.profileName}>Usuario</Text>
        <Text style={styles.profileEmail}>usuario@email.com</Text>
      </View>
      <View style={styles.profileOptions}>
        <TouchableOpacity style={styles.profileOption}>
          <MaterialIcons name="history" size={24} color="#6200EE" />
          <Text style={styles.profileOptionText}>Historial de Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileOption}>
          <MaterialIcons name="location-on" size={24} color="#6200EE" />
          <Text style={styles.profileOptionText}>Direcciones de Entrega</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileOption}>
          <MaterialIcons name="payment" size={24} color="#6200EE" />
          <Text style={styles.profileOptionText}>Métodos de Pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {currentTab === 'home' && <HomeScreen />}
      {currentTab === 'cart' && <CartScreen />}
      {currentTab === 'profile' && <ProfileScreen />}
      
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('home')}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={currentTab === 'home' ? '#6200EE' : '#666'}
          />
          <Text style={[
            styles.navText,
            { color: currentTab === 'home' ? '#6200EE' : '#666' }
          ]}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('cart')}
        >
          <View>
            <Animated.View style={{ transform: [{ scale: cartBounceValue }] }}>
              <MaterialIcons
                name="shopping-cart"
                size={24}
                color={currentTab === 'cart' ? '#6200EE' : '#666'}
              />
            </Animated.View>
            {totalCartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
              </View>
            )}
          </View>
          <Text style={[
            styles.navText,
            { color: currentTab === 'cart' ? '#6200EE' : '#666' }
          ]}>Carrito</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('profile')}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={currentTab === 'profile' ? '#6200EE' : '#666'}
          />
          <Text style={[
            styles.navText,
            { color: currentTab === 'profile' ? '#6200EE' : '#666' }
          ]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 70,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  productPrice: {
    fontSize: 18,
    color: '#6200EE',
    fontWeight: 'bold',
    marginTop: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButton: {
    backgroundColor: '#6200EE',
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  cartBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#FF5252',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: 'bold',
    marginTop: 4,
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  checkoutButton: {
    backgroundColor: '#6200EE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#1a1a1a',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileOptions: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileOptionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#1a1a1a',
  },
});

export default App;