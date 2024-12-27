import React, {useState} from 'react';
import {Formik, Form, FormikHelpers} from 'formik';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import logo from '../../images/getStartedAlt.png';
import {MessageContainer} from '../../components/InputFields';
import FormPage from '../../components/FormPage';
import {useAuth} from '../../context/AuthContext/AuthContext';
import {Button} from '@mui/material';
import {MixPanel} from '../../MixPanel';
import {trim} from 'ramda';
import * as yup from 'yup';
import {InputContainer, LinkSpan, PasswordInputContainer, SubmitBtnContainer} from './Signin.style';

type Values = {
  email: string;
  password: string;
};

const initialValues: Values = {
  email: '',
  password: '',
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const {login} = useAuth();
  const {search: searchParams} = useLocation();
  const [message, setMessage] = useState<string | undefined>(undefined);

  const onSubmit = ({email, password}: Values, {setSubmitting}: FormikHelpers<any>) => {
    setSubmitting(true);
    login(email.toLowerCase(), trim(password), (message) => {
      if (message) {
        setMessage(message);
        setSubmitting(false);
      } else {
        MixPanel.identify(email.toLowerCase());
        MixPanel.people.set({$email: email.toLowerCase()});
        MixPanel.track('Logged In', {});
        setSubmitting(false);
        if (localStorage.getItem('jwt_token')) {
          const redirectURL = new URLSearchParams(searchParams).get('redirect') || '/onboarding';
          const {pathname, search} = new URL(redirectURL, window.origin);

          navigate(`${pathname}${search}`, {state: {fromLogin: true}});
        }
      }
    });
  };

  return (
    <FormPage
      title="Sign In"
      subtitle={
        <div className="flex-with-center flex-wrap">
          {' '}
          Don't have an account?{' '}
          <Link to="/signup">
            <Button color="primary" className="text-button">
              <LinkSpan className="primary-text cursor-pointer">Sign Up</LinkSpan>
            </Button>
          </Link>
        </div>
      }
      image={logo}
      content={
        <Formik
          onSubmit={onSubmit}
          validateOnMount
          validateOnChange
          validationSchema={yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().required(),
          })}
          initialValues={initialValues}
        >
          {({isSubmitting, isValid}) => {
            return (
              <Form>
                <InputContainer inputProps={{id: 'email-input-field'}} name="email" label="Email"/>
                <PasswordInputContainer inputProps={{id: 'password-input-field'}} name="password" label="Password"
                                        removeSpaces/>

                <MessageContainer message={message} status="error"/>
                <SubmitBtnContainer id="signIn-button" text="Sign In" isSubmitting={isSubmitting} marginTop={0}
                                    disabled={!isValid}/>
              </Form>
            );
          }}
        </Formik>
      }
      terms={
        <div className="flex-with-center">
          {' '}
          Forgot Password?{' '}
          <Link
            to="/forgot-password"
            state={{email: ''}}
          >
            <Button color="primary" className="text-button">
              <LinkSpan className="primary-text cursor-pointer">Click here</LinkSpan>{' '}
            </Button>
          </Link>
        </div>
      }
    />
  );
};

export default SignIn;
