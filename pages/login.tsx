import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './auth.module.css';
import Link from 'next/link';
import Form from 'next/form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
      'Password must contain at least 8 characters, one letter and one number'
    ),
});

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = ctx.req.cookies;
  const accessToken = cookies['access_token'];

  if (accessToken) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default function Login() {
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    apiError?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as 'email' | 'password';
    const value = e.target.value;
    setFormData({
      ...formData,
      [fieldName]: value,
    });

    // Validate the single field
    try {
      LoginSchema.pick({ [fieldName]: true }).parse({
        [fieldName]: value,
      });
      setErrors(prev => ({ ...prev, [fieldName]: undefined })); // Clear the error for this field
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [fieldName]: error.errors[0]?.message }));
      }
    }
  };
  async function login(formData: FormData) {
    'use server';
    try {
      setIsSubmitting(true);
      setErrors({ email: '', password: '' });
      const { email, password } = LoginSchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
      });
      const response = await fetch(`/api/login-action`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setErrors({ apiError: data.message });
        throw new Error(data.message);
      }

      router.push('/home');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors({
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container size={'420'} p="xl">
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {errors.apiError && (
          <Text c="red" mb={10} ta="center">
            {errors.apiError}
          </Text>
        )}
        <Form formMethod="POST" action={login}>
          <TextInput
            label="Email"
            name="email"
            placeholder="you@mantine.dev"
            required
            error={errors.email}
            value={formData.email}
            onChange={handleChange}
          />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="Your password"
            required
            mt="md"
            error={errors.password}
            value={formData.password}
            onChange={handleChange}
          />

          <Button fullWidth mt="xl" type="submit">
            {isSubmitting ? 'Loading...' : 'Submit'}
          </Button>
        </Form>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor size="sm" component={Link} href={'/register'}>
            Create account
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
