import { Flex, Text } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";

const Header = () => {
  return (
    <Flex w="100%" pb={2}>
      <Avatar size="lg" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" colorPalette='teal'>
      </Avatar>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          Safekids Bot
        </Text>
        <Text color="green.500">Online</Text>
      </Flex>
    </Flex>
  );
};

export default Header;
