import { useEffect } from 'react';
import { validateUsername } from '../utils/validations/validateUsername';
import { validatePassword } from '../utils/validations/validatePassword';

export const useValidateInputs = (
  inputName: string,
  inputPassword: string,
  setValidatedName: (val: boolean) => void,
  setValidatedPassword: (val: string) => void,
) => {
  useEffect(() => {
    setValidatedName(validateUsername(inputName));
    setValidatedPassword(validatePassword(inputPassword, inputName));
  }, [inputName, inputPassword]);
};
