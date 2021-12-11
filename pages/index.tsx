import { Button, chakra, Container, Flex, Input, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [sessionId, setSessionId] = useState("");
  const [sessionPassword, setSessionPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      setSessionId(router.query.id as string);
    }
    if (router.query.password) {
      setSessionPassword(router.query.password as string);
    }
  }, [router.query]);

  return (
    <Container>
      <Flex align="center" justify="center" flexDir="column" minH="100vh">
        <Text as="h2" fontSize="4xl" fontWeight="bold">
          Join Session
        </Text>
        <Input
          w="300px"
          variant="flushed"
          mb="4"
          placeholder="Session ID"
          mt="8"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <Input
          w="300px"
          variant="flushed"
          mb="4"
          placeholder="Session Password"
          value={sessionPassword}
          onChange={(e) => setSessionPassword(e.target.value)}
        />
        <Input
          w="300px"
          variant="flushed"
          mb="4"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          w="300px"
          disabled={!sessionId || !sessionPassword || !username}
        >
          Join!
        </Button>
        <Text as="p" fontSize="sm" align="left" w="300px">
          <Link href="/create">
            <chakra.span textDecor="underline" cursor="pointer">
              Create a session
            </chakra.span>
          </Link>{" "}
          instead
        </Text>
      </Flex>
    </Container>
  );
};

export default Home;
