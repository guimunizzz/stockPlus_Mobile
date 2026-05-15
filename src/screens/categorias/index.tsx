import { StyleSheet, Text, View } from "react-native";

export default function Categoria() {

    return (
        <View style={styles.container}>
            <Text>Categoria</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: 10
    }
})