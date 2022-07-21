import { Button as NBButton, Heading, IButtonProps } from "native-base";

function Button({ children, ...rest }: IButtonProps) {
  return (
    <NBButton
      bg="green.700"
      h={14}
      fontSize="sm"
      rounded="sm"
      _pressed={{
        bg: "green.500",
      }}
      {...rest}
    >
      <Heading color="white" fontSize="sm">
        {children}
      </Heading>
    </NBButton>
  );
}

export default Button;
