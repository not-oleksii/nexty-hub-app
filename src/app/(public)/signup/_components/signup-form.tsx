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
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/constants/routes';

const formSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters long.'),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string().trim().min(1, 'Confirm password is required.'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });

type SignupFormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: SignupFormValues = {
  username: '',
  password: '',
  confirmPassword: '',
};

export function SignupForm() {
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
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
                          // eslint-disable-next-line react/jsx-no-bind
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
                          // eslint-disable-next-line react/jsx-no-bind
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
                          // eslint-disable-next-line react/jsx-no-bind
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
          <Field orientation="horizontal">
            <Button
              type="submit"
              className="w-full"
              form="signup-form"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? (
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
