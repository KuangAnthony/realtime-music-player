import {
  Button,
  chakra,
  Container,
  Flex,
  Input,
  Text,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [sessionPassword, setSessionPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    // GET COOKIE HERE INSTEAD AND REDIRECT IF FOUND
    // if (localStorage.getItem("session")) {
    //   const session = JSON.parse(localStorage.getItem("session") as string);
    //   setLoading(false);
    //   router.push(`/session?id=${session.session}`);
    // } else {
    //   setLoading(false);
    // }
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    if (!sessionPassword || !username) {
      return toast({
        title: "Missing fields",
        description: "Please fill out all fields",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/create", {
        password: sessionPassword,
        username,
      });

      if (res.status === 200) {
        toast({
          title: "Success",
          description: res.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        router.push(`/session?id=${res.data.session.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Flex
        align="center"
        justify="center"
        flexDir="column"
        minH="100vh"
        as="form"
        onSubmit={handleCreate}
      >
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
        <Button
          type="submit"
          w="300px"
          disabled={!sessionPassword || !username}
          isLoading={loading}
        >
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
