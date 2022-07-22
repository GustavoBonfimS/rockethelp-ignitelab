import { useState } from "react";
import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import { ChatTeardropText, SignOut } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";

import Logo from "../assets/logo_secondary.svg";
import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";
import Button from "../components/Button";

function Home() {
  const { colors } = useTheme();

  const navigation = useNavigation();

  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([
    {
      id: "1",
      patrimony: "0903984",
      when: "18/07/2022 às 10:00",
      status: "open",
    },
  ]);

  return (
    <VStack flex={1} bg="gray.700" pb={6}>
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.6 00"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton icon={<SignOut size={26} color={colors.gray["300"]} />} />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Meus chamados</Heading>
          <Text color="gray.200">3</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            onPress={() => setStatusSelected("open")}
            title="Em andamento"
            type="open"
            isActive={statusSelected === "open"}
          />
          <Filter
            onPress={() => setStatusSelected("closed")}
            title="Finalizados"
            type="closed"
            isActive={statusSelected === "closed"}
          />
        </HStack>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Order
              onPress={() =>
                navigation.navigate("details", {
                  orderId: item.id,
                })
              }
              data={item}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray["300"]} size={40} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"}
                solicitações{" "}
                {statusSelected === "open" ? "em andamento" : "finalizadas"}
              </Text>
            </Center>
          )}
        />

        <Button onPress={() => navigation.navigate("new")}>
          Nova solicitação
        </Button>
      </VStack>
    </VStack>
  );
}

export default Home;
