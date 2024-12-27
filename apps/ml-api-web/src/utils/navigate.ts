import { useNavigate } from 'react-router-dom';

let navigate;

export const NavigateSetter = () => {
  navigate = useNavigate();
  return null;
};

export const navigateTo = (path) => {
  if (navigate) {
    navigate(path);
  } else {
    console.error('Navigate function is not initialized.');
  }
};
