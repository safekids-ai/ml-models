import React, {JSX} from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useChatScroll } from "../../hooks/useChatScroll";
import { useColorModeValue } from '../ui/color-mode'
import { Avatar } from "../ui/avatar";
export interface Message {
    from: string,
    text: string | JSX.Element
}

const Messages: React.FC<{messages: Array<Message>}> = ({ messages }) => {
  const compColor = useColorModeValue("gray.100", "gray.300")
  const ref = useChatScroll(messages)
  return (
    <Flex w="100%" h="70%" overflowY="scroll" flexDirection="column" p="3" ref={ref}>
      {messages.map((item, index) => {
        if (item.from === "me") {
          return (
            <Flex key={index} w="100%" justify="flex-end">
              <Flex
                bg="black"
                color="white"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
                borderRadius="15px"
              >
                <Text as="div">{item.text}</Text>
              </Flex>
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%" gap={2}>
              <Avatar
                name="Computer"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="blue.300"
                m={3}
              ></Avatar>
              <Flex
                bg={compColor}
                color="black"
                minW="100px"
                maxW="350px"
                my="1"
                p={3}
                borderRadius="15px"
              >
                <Text as="div" className="compmessage test">{item.text}</Text>
              </Flex>
            </Flex>
          );
        }
      })}
    </Flex>
  );
};

export default Messages;
