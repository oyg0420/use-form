import { ChangeEvent, FormEvent, useRef, useState } from "react";

type FormTypes<FormValues> = {
  defaultValues: { [Property in keyof FormValues]: FormValues[Property] };
};

type FormStates<FormValues> = {
  isDirty: boolean;
  isValid: boolean;
  values: { [Property in keyof FormValues]: FormValues[Property] };
} & FormErrors<FormValues>;

type FormErrors<FormValues> = {
  errors?: {
    [Property in keyof FormValues]: string;
  };
};

type SubmitSuccessHandler<FormValues> = (
  values: FormStates<FormValues>["values"]
) => void;

type SubmitFailedHandler<FormValues> = (
  erros: FormStates<FormValues>["errors"]
) => void;

type FormOption<FormValues> = {
  [Property in keyof FormValues]: Option;
};

type Option = {
  rules?: {
    required?: string;
  };
};

const useForm = <FormValues>({ defaultValues }: FormTypes<FormValues>) => {
  const [formStates, setFormStates] = useState<FormStates<FormValues>>({
    isDirty: false,
    isValid: false,
    values: defaultValues,
  });

  const formStatesRef = useRef<FormStates<FormValues>>(formStates);
  const formErrorsRef = useRef<FormErrors<FormValues> | undefined>();
  const formOptionRef = useRef<FormOption<FormValues> | undefined>();

  const handleSubmit =
    (
      onSubmitSuccess: SubmitSuccessHandler<FormValues>,
      onSubmitFailed: SubmitFailedHandler<FormValues>
    ) =>
    (e: FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }
      setFormStates(formStatesRef.current);
      if (formStatesRef.current.isValid) {
        onSubmitSuccess(formStatesRef.current.values);
      } else {
        onSubmitFailed(formStatesRef.current.errors);
      }
    };

  const handleValueChange = (
    value: string,
    name: Partial<keyof FormValues>
  ) => {
    formStatesRef.current.values = {
      ...formStatesRef.current.values,
      [name]: value,
    };
  };

  const getValue = (name: Partial<keyof FormValues>) => {
    return formStatesRef.current.values[name];
  };

  const register = (name: Partial<keyof FormValues>, option?: Option) => {
    if (formOptionRef.current) {
      formOptionRef.current = {
        ...formOptionRef.current,
        [name]: option,
      };
    } else {
      formOptionRef.current = {
        [name]: option,
      } as FormOption<FormValues>;
    }

    return {
      defaultValue: formStatesRef.current.values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        handleValueChange(event.target.value, name),
    };
  };

  return {
    handleSubmit,
    register,
    getValue,
  };
};

export default useForm;
