import Sidebar from "../../components/sidebar";
import { Flex, Avatar, Heading, Input, FormControl, Button, Text } from '@chakra-ui/react'
import Head from "next/head";
import { useRouter } from "next/router";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import getOtherEmail from "../../utils/getOtherEmail";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";

const TopBar = ({email}) => {
  return (
    <Flex bg="gray.200" h="81px" w="100%" align="center" p={5}>
      <Avatar src="" marginEnd={3}/>
      <Heading>{email}</Heading>
    </Flex>
  )
}

const BottomBar = ({id, user}) => {
  const [input, setInput] = useState("")
  const sendMessage = async e => {
    e.preventDefault()
    await addDoc(collection(db, `chats/${id}/messages`), {
      text: input,
      sender: user.email,
      timestamp: serverTimestamp()
    })
    setInput("")
  }

  return (
    <FormControl p={3} onSubmit={sendMessage} as="form">
      <Input placeholder="Type a message..." autoComplete="off" onChange={e => setInput(e.target.value)} value={input}/>
      <Button hidden type="submit"></Button>
    </FormControl>
  )
}

export default function Chat() {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const { id } = router.query
  const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp"))
  const [messages] = useCollectionData(q)
  const [chat] = useDocumentData(doc(db, "chats", id))
  const bottomOfChat = useRef()
  const getMessages = () => messages?.map(msg => {
    const sender = msg.sender === user.email
    return (
      <Flex key={Math.random()} w="fit-content" minWidth="100px" borderRadius="lg" p={3}
        m={1} alignSelf={sender ? "flex-start" : "flex-end"} bg={sender ? "blue.100" : "green.100" }>
          <Text>{ msg.text }</Text>
      </Flex>
    )
  })
  useEffect(() => {
    setTimeout(
    bottomOfChat.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    }),100)
  }
  ,[messages])

  return (
    <Flex h="100vh">
      <Head>
        <title>Chat App</title>
      </Head>
      <Sidebar />
      <Flex flex={1} direction="column">
        <TopBar email={getOtherEmail(chat?.users, user)}/>
        <Flex flex={1} direction="column" pt={4} mx={5} overflowX="scroll"
          sx={{
            '&::-webkit-scrollbar': {
              width: '0'
            }
          }}>
          {getMessages()}
          <div ref={bottomOfChat}></div>
        </Flex>
        <BottomBar id={id} user={user}/>
      </Flex>
    </Flex>
  )
}