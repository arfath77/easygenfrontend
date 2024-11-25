import { Center, Container, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = ctx.req.cookies;
  const accessToken = cookies['access_token'];

  if (!accessToken) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default function Home() {
  return (
    <Container p="xl">
      {/* <Box
        mt={20}
        pos={'absolute'}
        right={{ md: '10' }}
        top={{ base: 130, md: 10 }}
      >
        <Button component="a" href="/logout-action">
          Logout
        </Button>
      </Box> */}
      <Center>
        <Title order={1}>Welcome to the application.</Title>
      </Center>
    </Container>
  );
}
