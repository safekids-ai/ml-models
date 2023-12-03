import React, { useEffect } from 'react';
import TextClassificationPrompt from '../components/nlp/TextClassificationPrompt';
import { useLocation } from 'react-router-dom';

const Docs = () => {
  const prompts = [
    {
      name: 'Hate Bullying',
      example: 'Sample Text: "you are an asshole."',
    },
    {
      name: 'Adult',
      example: 'Sample Text: "find adult sex links videos"',
    },
    {
      name: 'Proxy',
      example:
        'Sample Text: "7 Best Proxy Websites For Schools to Access Blocked Websites"',
    },
    {
      name: 'Weapons',
      example: 'Sample Text: "The Most Trusted Place To Buy Guns :: Guns.com"',
    },
    {
      name: 'Self-harm',
      example: 'Sample Text: "Cutting and Self-Harm"',
    },
  ];
  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;

    // If there's a hash, scroll to the corresponding element
    if (hash) {
      const element = document.getElementById(hash.substring(1));

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  return (
    <div>
      <TextClassificationPrompt prompts={prompts} />
    </div>
  );
};

export default Docs;
