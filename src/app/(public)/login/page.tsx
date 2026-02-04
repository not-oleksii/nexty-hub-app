import { ContentWrapper } from '@/components/layout/content';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { LoginForm } from './_components/login-form';

export default function LoginPage() {
  return (
    <ContentWrapper className="flex items-center justify-center">
      <Card className="mt-32 w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your username and password to login.
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </ContentWrapper>
  );
}
