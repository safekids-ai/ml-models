import React from 'react';
import {Language} from '@shared/types/Language.type';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {HttpUtils} from '@shared/utils/HttpUtils';

const defaultLanguage = {name: 'English', id: 'en', direction: 'ltr'};
/* istanbul ignore next */
const useLanguageMessage = (): [{}, Language] => {
  const [messages, setMessages] = React.useState({});
  const [language, setLanguage] = React.useState<Language>(defaultLanguage);
  /* istanbul ignore next */
  React.useEffect(() => {
    const logger = ChromeCommonUtils.getLogger();

    async function loadLanguage() {
      let value: Language = await ChromeCommonUtils.readLocalStorage('language');
      if (!value) {
        value = defaultLanguage;
      }
      try {
        const data = await HttpUtils.loadJson('../i18n/messages_grade_2to4_' + value.id + '.json');
        setMessages(data);
      } catch (err) {
        logger.error(err);
      }
      setLanguage(value);
    }

    loadLanguage();
  }, []);

  return [messages, language];
};

export default useLanguageMessage;
