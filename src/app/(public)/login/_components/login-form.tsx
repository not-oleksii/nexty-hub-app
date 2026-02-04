'use client';

import { SubmitEvent, useCallback } from 'react';
import Link from 'next/link';

import { useForm } from '@tanstack/react-form-nextjs';
import { ArrowRightIcon } from 'lucide-react';
import { z } from 'zod';

import { Body } from '@/components/typography/body';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';

const formSchema = z.object({
  username: z.string().trim().min(1, 'Username is required.'),
  password: z.string().trim().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: LoginFormValues = {
  username: '',
  password: '',
};

export function LoginForm() {
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const onSubmitClick = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <>
      <CardContent>
        <form id="login-form" onSubmit={onSubmitClick}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <form.Field name="username">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          // eslint-disable-next-line react/jsx-no-bind
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Enter your username"
                          required
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          // eslint-disable-next-line react/jsx-no-bind
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="••••••••"
                          type="password"
                          required
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-2">
          <Field orientation="horizontal">
            <Button type="submit" className="w-full" form="login-form">
              Login
            </Button>
          </Field>
          <div className="flex w-full items-center">
            <div className="flex items-center gap-2">
              <Body>Don&apos;t have an account?</Body>
              <ArrowRightIcon size={16} />
            </div>
            <Button variant="link" className="p-2">
              <Link href={ROUTES.signup}>Signup Now!</Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
