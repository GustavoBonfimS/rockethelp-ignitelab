import { useState } from "react";
import { Heading, Icon, useTheme, VStack } from "native-base";
import auth from "@react-native-firebase/auth";
import { Envelope, Key } from "phosphor-react-native";

import Logo from "../assets/logo_primary.svg";

import Button from "../components/Button";
import Input from "../components/Input";
import { Alert } from "react-native";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme();

  async function handleSignIn() {
    try {
      if (!email || !password) {
        Alert.alert("Entrar", "Por favor informe e-mail e senha");
        return;
      }

      setIsLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.log(err);
      setIsLoading(false);

      if (err.code === 'auth/invalid-email') {
        Alert.alert('Entrar', 'E-mail inválido.');
        return;
      }

      if (err.code === 'auth/user-not-found') {
        Alert.alert('Entrar', 'Usuário não cadastrado.');
        return;
      }

      if (err.code === 'auth/wrong-password') {
        Alert.alert('Entrar', 'E-mail ou senha inválidos.');
        return;
      }

      Alert.alert('Entrar', 'Ocorreu um erro ao tentar entrar.');
    }
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        mb={4}
        placeholder="E-mail"
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray["300"]} />} ml={4} />
        }
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={
          <Icon as={<Key color={colors.gray["300"]} />} ml={4} />
        }
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button w="full" onPress={handleSignIn} isLoading={isLoading}>
        Entrar
      </Button>
    </VStack>
  );
};

export default SignIn;
