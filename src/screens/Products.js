import React from 'react';
import { View, Text, Button, FlatList, StyleSheet} from 'react-native';
import useCartStore from '../store/cartStore';

const products = [
    {id: '1', name: 'Matematicas para Todos', price: 25},
    {id: '2', name: 'Historia Universal', price: 20},
    {id: '3', name: 'Ciencias Naturales', price: 30},
    {id: '4', name: 'Lengua y Literatura', price: 22},
];

const Products = ({ navigation }) => {
    const addToCart = useCartStore((state) => state.addToCart); //accedemos a la funcion addToCart del store

    const handleAddToCart = (product) => {
        addToCart(product);
        alert(`€{product.name} añadido al carrito`);
    };

    return (
        <View style = {StyleSheet.container}>
            <Text style={StyleSheet.title}>Productos (Libros Escolares)</Text>
            <FlatList
            data={products}
            renderItem={({ item }) => (
                <View style={Styles.productConatiner}>
                    <Text>{item.name}</Text>
                    <Text>€{item.price}</Text>
                    <Button
                        title="Añadir al carrito"
                        onPress={()=> handleAddToCart(item)}
                    />
                </View>
            )}
            keyExtractor={(item) => item.id}
            />
            <Button title="Ver Carrito" onPress={()=> navigation.navigate('Cart')}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title:{
        fontSize: 24,
        marginBottom: 16,
    },
    productConatiner: {
        marginBottom: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    }, 
});

export default Products;