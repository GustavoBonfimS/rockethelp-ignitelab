import { useEffect, useState } from "react";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HStack, Text, VStack, useTheme, ScrollView, Box } from "native-base";
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  Clipboard,
} from "phosphor-react-native";

import Header from "../components/Header";
import { CardDetails } from "../components/CardDetails";
import { OrderProps } from "../components/Order";
import Loading from "../components/Loading";
import Input from "../components/Input";
import Button from "../components/Button";

import { OrderFirestoreDTO } from "../DTOs/OrderDTO";

import { dateFormat } from "../utils/firestoreDateFormat";

interface RouteParams {
  orderId: string;
}

interface OrderDetails extends OrderProps {
  description: string;
  solution?: string;
  closed: string;
}

function Details() {
  const route = useRoute();

  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { orderId } = route.params as RouteParams;

  const { colors } = useTheme();
  const navigation = useNavigation();

  async function handleOrderClose() {
    try {
      if (!solution) {
        Alert.alert("Solicitação", "Por favor informe uma solução.");
        return;
      }

      setIsSubmitting(true);
      await firestore()
        .collection<OrderFirestoreDTO>("orders")
        .doc(orderId)
        .update({
          status: "closed",
          solution,
          closed_at: firestore.FieldValue.serverTimestamp(),
        });

      setIsSubmitting(false);
      Alert.alert("Solicitação", "Solicitação encerrada.");
      navigation.goBack();
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
      Alert.alert("Solicitação", "Não foi possível encerrar a solicitação.");
    }
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green["300"]} />
        ) : (
          <Hourglass size={22} color={colors.secondary["700"]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green["300"]
              : colors.secondary["700"]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Finalizado" : "Em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimonio ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />

        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={Clipboard}
        />

        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          footer={order.status === "closed" && `Encerrado em ${order.closed}`}
          description={order.solution}
        >
          {order.status === "open" && (
            <Input
              textAlignVertical="top"
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              multiline
              h={24}
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button m={5} onPress={handleOrderClose} isLoading={isSubmitting}>
          Encerrar solicitação
        </Button>
      )}
    </VStack>
  );
}

export default Details;
