import { StyleSheet, Text, View } from "react-native";


export default function Produtos() {

  return (
    <View style={styles.container}>
      <Text>Produtos</Text>
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