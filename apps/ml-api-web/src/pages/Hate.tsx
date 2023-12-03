import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import Divider from "../components/messages/Divider";
import Footer from "../components/messages/Footer";
import Header from "../components/messages/Header";
import Messages, { Message } from "../components/messages/Messages";
import {NLPResult} from "@safekids-ai/nlp-js-types";
import axios from "axios";
import { API_URL } from "../config";

const Hate = () => {
  const [messages, setMessages] = useState<Message[]>([
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

    const req = await axios.post<NLPResult>(API_URL + "/api/v1/classify-hate", { message: prevMessage })
    const res = req.data;
    console.log(res, res.flag)
    const arr = prevMessage.split(res.flaggedText)
    const data = res.flag ? <div>{arr[0]}<span className="tooltip">{res.flaggedText}<span className="tooltiptext">Flagged as {res.label}</span></span>{arr[1]}</div>: "Not flagged"
    console.log(data)
    setMessages((old) => [...old, { from: "computer", text: data }]);
  };

  return (
    <Flex w="100%" h="100vh" justify="center" marginTop="4">
      <Flex w={{base: "100%", md: "100%", xl: "40%"}} h="80%" flexDir="column">
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
