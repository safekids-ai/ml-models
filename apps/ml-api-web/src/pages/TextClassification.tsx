import { Flex, ListItem, UnorderedList, Text } from '@chakra-ui/react';
import { useState } from 'react';
import Divider from '../components/messages/Divider';
import Footer from '../components/messages/Footer';
import Header from '../components/messages/Header';
import Messages, { Message } from '../components/messages/Messages';
import { NLPLabel, NLPResult } from '@safekids-ai/nlp-js-types';
import axios from 'axios';
import {Link} from 'react-router-dom'
import TextClassificationPrompt from '../components/nlp/TextClassificationPrompt';
import { API_URL } from '../config';
const TextClassification = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'computer',
      text: (
        <Text>
          Hi, I am the model that can determine the intent of a google search
          based on the page titles returned from the search.
          <br></br>
          <br></br>
          See the <Link to="/docs#nlp2">Docs</Link> to learn more
          <br></br>
          <br></br>
        </Text>
      ),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const prevMessage = inputMessage;

    setMessages((old) => [...old, { from: 'me', text: prevMessage }]);
    setInputMessage('');
    
    const req = await axios.post<string>(
      API_URL + '/api/v1/classify-text',
      { message: prevMessage }
    );
    const res = req.data;
    const data =
      res !== NLPLabel.Clean ? (
        <div>
          The intent is <span className="red-underline">{res}</span>
        </div>
      ) : (
        'The intent is clean'
      );
    console.log(data);
    setMessages((old) => [...old, { from: 'computer', text: data }]);
  };

  return (
    <Flex w="100%" h="100vh" justify="center" marginTop="4">
      <Flex
        w={{ base: '100%', md: '100%', xl: '40%' }}
        h="80%"
        flexDir="column"
      >
        <Header />
        <Divider />
        <Messages messages={messages} />
        <Divider />
        <Footer
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          disabled={
            messages[messages.length - 1].from === 'me' &&
            inputMessage.trim().length === 0
          }
        />
      </Flex>
    </Flex>
  );
};

export default TextClassification;
