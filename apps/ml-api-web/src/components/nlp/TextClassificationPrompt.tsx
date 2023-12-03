import { UnorderedList, ListItem, ListIcon, List } from '@chakra-ui/react';
import React from 'react';
import { GoDash } from 'react-icons/go';

interface Props {
  name: string;
  example: string;
}
function TextClassificationPrompt(props: { prompts: Props[] }) {
  const { prompts } = props;
  return (
    <div>
      <UnorderedList spacing={3} id="nlp">
        {prompts.map((prompt, i) => (
          <ListItem key={i}>
            {prompt.name}
            <List spacing={3}>
              <ListItem>
                <ListIcon>
                  <GoDash />
                </ListIcon>
                {prompt.example}
              </ListItem>
            </List>
          </ListItem>
        ))}
      </UnorderedList>
    </div>
  );
}

export default TextClassificationPrompt;
