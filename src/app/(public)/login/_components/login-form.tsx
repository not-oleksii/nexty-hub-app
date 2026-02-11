'use client';

import { SubmitEvent, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { type LoginSchema, loginSchema } from '@/lib/validators/login';
import { authMutations } from '@/server/api/queries/auth.queries';
import { clearSessionCache } from '@/server/api/queries/session-cache';

const DEFAULT_VALUES: LoginSchema = {
  username: '',
  password: '',
};

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError, isSuccess } = useMutation(
    authMutations.login(),
  );
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: loginSchema,
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          username: value.username.trim(),
          password: value.password,
        });

        clearSessionCache(queryClient);

        router.push(ROUTES.discoverList.root);
        router.refresh();
      } catch (error: unknown) {
        console.error('Error logging in:', error);
      }
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
          {isError && (
            <Body className="text-destructive">{getErrorMessage(error)}</Body>
          )}
          {isSuccess && (
            <Body className="text-success">
              Login successful. You are now logged in.
            </Body>
          )}
          <Field orientation="horizontal">
            <Button
              type="submit"
              className="w-full"
              form="login-form"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting || isPending ? (
                <>
                  <Spinner data-icon="inline-start" /> Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Field>
          <div className="flex w-full items-center">
            <div className="flex items-center gap-2">
              <Body>Don&apos;t have an account?</Body>
              <ArrowRightIcon size={16} />
            </div>
            <Button variant="link" className="p-2">
              <Link href={ROUTES.signup}>Sign Up Now!</Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
