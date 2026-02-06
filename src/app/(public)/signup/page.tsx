import { ContentWrapper } from '@/components/layout/content';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { SignupForm } from './_components/signup-form';

export default function SignupPage() {
  return (
    <ContentWrapper className="flex items-center justify-center">
      <Card className="mt-32 w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your username and password to Sign Up.
          </CardDescription>
        </CardHeader>
        <SignupForm />
      </Card>
    </ContentWrapper>
  );
}
