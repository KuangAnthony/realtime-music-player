import { Button, chakra, Container, Flex, Input, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

const Home: NextPage = () => {
  const [sessionPassword, setSessionPassword] = useState("");
  const [username, setUsername] = useState("");

  return (
    <Container>
      <Flex align="center" justify="center" flexDir="column" minH="100vh">
        <Text as="h2" fontSize="4xl" fontWeight="bold">
          Create Session
        </Text>
        <Input
          w="300px"
          variant="flushed"
          mb="4"
          mt="8"
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
        <Button w="300px" disabled={!sessionPassword || !username}>
          Create!
        </Button>
        <Text as="p" fontSize="sm" align="left" w="300px">
          <Link href="/">
            <chakra.span textDecor="underline" cursor="pointer">
              Join a session
            </chakra.span>
          </Link>{" "}
          instead
        </Text>
      </Flex>
    </Container>
  );
};

export default Home;
