import { Box, Flex } from '@chakra-ui/react';
import { GoDash } from 'react-icons/go';

interface Props {
  name: string;
  example: string;
}
function TextClassificationPrompt(props: { prompts: Props[] }) {
  const { prompts } = props;
  return (
    <div>
      <Box as="ul" listStyleType="none">
        {prompts.map((prompt, i) => (
          <li key={i}>
            {prompt.name}
            <Box as="ul" gap={3} listStyleType='none' pl={0}>
              <Flex as="li" alignItems='center'>
                <Box as='span' className="icon" mr='5px'>
                  <GoDash />
                </Box>
                {prompt.example}
              </Flex>
            </Box>
          </li>
        ))}
      </Box>
    </div>
  );
}

export default TextClassificationPrompt;
