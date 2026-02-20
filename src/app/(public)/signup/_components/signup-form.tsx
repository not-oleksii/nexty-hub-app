'use client';

import { SubmitEvent, useCallback } from 'react';
import Link from 'next/link';

import { useForm } from '@tanstack/react-form-nextjs';
import { useMutation } from '@tanstack/react-query';
import { ArrowRightIcon } from 'lucide-react';

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
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/utils/common';
import { type SignupSchema, signupSchema } from '@/lib/validators/signup';
import { usersMutations } from '@/server/api/queries/users.queries';

const DEFAULT_VALUES: SignupSchema = {
  username: '',
  password: '',
  confirmPassword: '',
};

export function SignupForm() {
  const { mutateAsync, isPending, error, isError, isSuccess } = useMutation(
    usersMutations.create(),
  );

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: signupSchema,
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          username: value.username.trim(),
          password: value.password,
          confirmPassword: value.confirmPassword,
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const onSubmitClick = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <>
      <CardContent>
        <form id="signup-form" onSubmit={onSubmitClick}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <form.Field name="username">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Enter your username"
                          required
                          aria-invalid={isInvalid}
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
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          aria-invalid={isInvalid}
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Enter your password"
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
                <form.Field name="confirmPassword">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Confirm your password"
                          type="password"
                          required
                          aria-invalid={isInvalid}
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
          {isSuccess && (
            <Body className="text-success">
              Account created successfully. You can now log in.
            </Body>
          )}
          {isError && (
            <Body className="text-destructive">{getErrorMessage(error)}</Body>
          )}
          <Field orientation="horizontal">
            <Button
              type="submit"
              className="w-full"
              form="signup-form"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting || isPending ? (
                <>
                  <Spinner data-icon="inline-start" /> Signing up...
                </>
              ) : (
                'Signup'
              )}
            </Button>
          </Field>
          <div className="flex w-full items-center">
            <div className="flex items-center gap-2">
              <Body>Already have an account?</Body>
              <ArrowRightIcon size={16} />
            </div>
            <Button variant="link" className="p-2">
              <Link href={ROUTES.login}>Login!</Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
