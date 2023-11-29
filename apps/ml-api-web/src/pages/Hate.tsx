import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import Divider from "../components/messages/Divider";
import Footer from "../components/messages/Footer";
import Header from "../components/messages/Header";
import Messages from "../components/messages/Messages";
import {NLPResult} from "@safekids-ai/nlp-js-types";
import axios from "axios";

const Hate = () => {
  const [messages, setMessages] = useState([
    { from: "computer", text: "Hi, My Name is HoneyChat" },
    { from: "me", text: "Hey there" },
    { from: "me", text: "Myself Ferin Patel" },
    {
      from: "computer",
      text:
        "Nice to meet you. You can send me message and i'll tell you if it is hate speech or not",
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const prevMessage = inputMessage;

    setMessages((old) => [...old, { from: "me", text: prevMessage }]);
    setInputMessage("");

    const req = await axios.post<NLPResult>("http://localhost:3000/api/v1/classify-hate", { message: prevMessage })
    const res = req.data;
    console.log(res, res.flag)
    const arr = prevMessage.split(res.flaggedText)
    const data = res.flag ? `${arr[0]}<span class="tooltip">${res.flaggedText}<span class="tooltiptext">Flagged as ${res.label}</span></span>${arr[1]}`: "Not flagged"
    console.log(data)
    setMessages((old) => [...old, { from: "computer", text: data }]);
  };

  return (
    <Flex w="100%" h="100vh" justify="center">
      <Flex w={["100%", "100%", "40%"]} h="80%" flexDir="column">
        <Header />
        <Divider />
        <Messages messages={messages} />
        <Divider />
        <Footer
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          disabled={messages[messages.length - 1].from === "me" && inputMessage.trim().length === 0}
        />
      </Flex>
    </Flex>
  );
};

export default Hate;
