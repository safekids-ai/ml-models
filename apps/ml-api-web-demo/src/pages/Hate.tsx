import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import Footer from "../components/messages/Footer";
import Header from "../components/messages/Header";
import Messages, { Message } from "../components/messages/Messages";
import {NLPResult} from "@safekids-ai/nlp-js-types";
import axios from "axios";
import { API_URL } from "../config";

const Hate = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "computer",
      text:
        "Hi, this is Safe Kids bot. You can send me message and i'll tell you if it is toxic speech or not. I'll underline the toxic part of the speech.",
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

    const req = await axios.post<NLPResult>(API_URL + "/v1/ml/classify-toxic", { message: prevMessage })
    const res = req.data;
    console.log(res, res.flag)
    const arr = prevMessage.split(res.flaggedText)
    const data = res.flag ? <div>{arr[0]}<span className="tooltip">{res.flaggedText}<span className="tooltiptext">Flagged as {res.label}</span></span>{arr[1]}</div>: "Text looks clean"
    console.log(data)
    setMessages((old) => [...old, { from: "computer", text: data }]);
  };

  return (
    <Flex w="100%" h='calc(100vh - 112px)' justify="center" marginTop="4">
      <Flex w={{base: "100%", md: "100%", xl: "40%"}} flexDir="column" divideY='3px'>
        <Header />
        <Messages messages={messages} />
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
