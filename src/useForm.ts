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

type Option = {
  rules?: {
    required?: string;
  };
};

type FormFiels<FormValues> = {
  [Property in keyof FormValues]: { ref: HTMLInputElement; option: Option };
};

const useForm = <FormValues>({ defaultValues }: FormTypes<FormValues>) => {
  const [formStates, setFormStates] = useState<FormStates<FormValues>>({
    isDirty: false,
    isValid: false,
    values: defaultValues,
  });

  const formStatesRef = useRef<FormStates<FormValues>>(formStates);
  const formFieldsRef = useRef<FormFiels<FormValues | undefined>>();

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
    if (formFieldsRef.current) {
      formFieldsRef.current[name].ref.value = value;
    }
  };

  const getValue = (name: Partial<keyof FormValues>) => {
    if (formFieldsRef.current) {
      return formFieldsRef.current[name].ref.value;
    }
    return undefined;
  };

  const register = (name: Partial<keyof FormValues>, option?: Option) => {
    return {
      ref: (ref: HTMLInputElement) => {
        if (formFieldsRef.current) {
          formFieldsRef.current = {
            ...formFieldsRef.current,
            [name]: { ref, option },
          };
        } else {
          formFieldsRef.current = {
            [name]: { ref, option },
          } as FormFiels<FormValues>;
        }
      },
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
