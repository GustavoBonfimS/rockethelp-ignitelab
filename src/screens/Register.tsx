import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { VStack } from "native-base";

import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import { Alert } from "react-native";

function Register() {
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  async function handleNewOrderRegister() {
    try {
      if (!patrimony || !description) {
        Alert.alert("Registrar", "Preencha todos os campos.");
        return;
      }

      setIsLoading(true);
      await firestore().collection("orders").add({
        patrimony,
        description,
        status: "open",
        created_at: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert("Solicitação", "Solicitação registrada com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      Alert.alert("Solicitação", "Ocorreu um erro ao criar a solicitação.");
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação" />

      <Input placeholder="Numero do patrimonio" mt={4} onChangeText={setPatrimony} value={patrimony} />
      <Input
        placeholder="Descrição do problema"
        mt={5}
        flex={1}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
        value={description}
      />

      <Button mt={5} onPress={handleNewOrderRegister} isLoading={isLoading}>
        Cadastrar
      </Button>
    </VStack>
  );
}

export default Register;
