import { StyleSheet, Text, View } from "react-native";


export default function Estoque() {

  return (
    <View style={styles.container}>
      <Text>Estoque</Text>
    </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 10
  }
})