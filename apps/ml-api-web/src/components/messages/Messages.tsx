import React from "react";
import { Avatar, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import parse from "html-react-parser";
import { useChatScroll } from "../../hooks/useChatScroll";

interface Message {
    from: string,
    text: string
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
                <Text>{item.text}</Text>
              </Flex>
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                name="Computer"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="blue.300"
              ></Avatar>
              <Flex
                bg={compColor}
                color="black"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
                borderRadius="15px"
              >
                <Text>{parse(item.text)}</Text>
              </Flex>
            </Flex>
          );
        }
      })}
    </Flex>
  );
};

export default Messages;
