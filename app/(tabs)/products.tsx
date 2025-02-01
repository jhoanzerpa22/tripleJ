import React, { useState } from 'react';
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const productos = [
    {
      id: 1,
      nombre: 'Harina',
      precio: 1,
      imagen: 'https://m.media-amazon.com/images/I/81zOf6Jl88L._AC_UF894,1000_QL80_.jpg',
    },
    {
      id: 2,
      nombre: 'Cafe',
      precio: 2,
      imagen: 'https://locatelvenezuela.vtexassets.com/arquivos/ids/172491/2099057.jpg?v=638018747766430000',
    },
  ];
  
  const Producto = ({ producto }: any) => {
    const [cantidad, setCantidad] = useState(1);
  
    const agregarAlCarrito = () => {
      console.log('Producto agregado al carrito:', producto, cantidad);
    };
  
    return (
      <View className='bg-white rounded-lg m-3 p-3 shadow-md overflow-hidden' >
        <Image source={{ uri: producto.imagen }} className="w-full h-48 object-cover"/>
        <Text className="text-lg font-semibold">{producto.nombre}</Text>
        <Text className="text-xl font-bold">${producto.precio}</Text>
        <View className="mt-2 flex justify-between items-center">
          <TouchableOpacity onPress={() => setCantidad(Math.max(1, cantidad - 1))}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{cantidad}</Text>
          <TouchableOpacity onPress={() => setCantidad(cantidad + 1)}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors" onPress={agregarAlCarrito}>
          <Text style={styles.agregarTexto}>Agregar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  

export default function ProductScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        renderItem={({ item }) => <Producto producto={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        style={styles.listaProductos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  listaProductos: {
    flex: 1,
  },
  productoContainer: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  productoImagen: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  productoNombre: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productoPrecio: {
    marginBottom: 5,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  agregarBoton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  agregarTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});
