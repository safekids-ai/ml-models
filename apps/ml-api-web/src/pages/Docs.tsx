import React, {useEffect} from 'react';
import TextClassificationPrompt from '../components/nlp/TextClassificationPrompt';
import {Link, useLocation} from 'react-router-dom';
import {Button, Container, Flex, Heading, Stack, Text, Box, VStack, Code, Divider} from "@chakra-ui/react";

const Docs = () => {
  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;

    // If there's a hash, scroll to the corresponding element
    if (hash) {
      const element = document.getElementById(hash.substring(1));

      if (element) {
        element.scrollIntoView({behavior: 'smooth'});
      }
    }
  }, []);

  return (
    <Container maxW={'5xl'}>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{base: 8, md: 10}}
        py={{base: 20, md: 28}}>
        <Heading
          fontWeight={600}
          fontSize={{base: '3xl', sm: '4xl', md: '6xl'}}
          lineHeight={'110%'}>
          Check out our{' '}
          <Text as={'span'} color={'orange.400'}>
            API and Usage
          </Text>
        </Heading>
        <Text color={'gray.500'} maxW={'3xl'}>
          Use our models to detect hate speech, search intent, and explicit/violent images.
        </Text>
        <Stack spacing={6} direction={'row'}>
          <Button
            rounded={'full'}
            px={6}
            colorScheme={'orange'}
            backgroundColor={'orange.400'}
            _hover={{bg: 'orange.500'}}
            as={Link}
            to="/hate">
            Get started
          </Button>
          <Button as={Link} to="/docs" rounded={'full'} px={6}>
            Learn more
          </Button>
        </Stack>

        <Stack textAlign={'left'}
               align={'left'}>

          <Heading color={'orange'} maxW={'3xl'} size={'md'} textAlign={'left'} lineHeight={'taller'}>
            Use the following prompts as an example:
          </Heading>
          <Text color={'gray.500'} maxW={'3xl'} textAlign={'left'}>
            Hate Bullying - Sample Text: "you're a disgusting person"
          </Text>

          <Text color={'gray.500'} maxW={'3xl'} textAlign={'left'}>
            Adult - Sample Text: "find adult sex links videos"
          </Text>

          <Text color={'gray.500'} maxW={'3xl'} textAlign={'left'}>
            Proxy - Sample Text: "7 Best Proxy Websites For Schools to Access Blocked Websites"
          </Text>

          <Text color={'gray.500'} maxW={'3xl'} textAlign={'left'}>
            Weapons - Sample Text: "The Most Trusted Place To Buy Guns :: Guns.com"
          </Text>

          <Text color={'gray.500'} maxW={'3xl'} textAlign={'left'}>
            Self-harm - Sample Text: "Cutting and Self-Harm"
          </Text>
        </Stack>

        <Stack textAlign={'left'}
               align={'left'}>

          <Heading color={'orange'} maxW={'3xl'} size={'md'} textAlign={'left'} lineHeight={'taller'}>
            Use the following API endpoints:
          </Heading>

          <Box>
            <Text fontWeight="bold">Endpoint:</Text>
            <Code p={2}>https://api.safekids.ai/api/v1/classify-hate</Code>
          </Box>

          <Box>
            <Text fontWeight="bold">Description:</Text>
            <Text>Classify if the language has hateful language</Text>
          </Box>

          <Box>
            <Text fontWeight="bold">Example Request:</Text>
            <Code p={2} whiteSpace="pre">
              {`POST /v1/classify-hate\n{\n  "message": "you're a disgusting person."\n}`}
            </Code>
          </Box>

          <Box>
            <Text fontWeight="bold">Example Response:</Text>
            <Code p={2} whiteSpace="pre" colorScheme="green">
              {`200 OK\n{\n  "flag" : true, "label" : "hate", "flaggedText" : "you're a disgusting person"\n}`}
            </Code>
          </Box>

        </Stack>

      </Stack>
    </Container>
  )
  // return (
  //   <div>
  //     <TextClassificationPrompt prompts={prompts} />
  //   </div>
  // );
};

export default Docs;
