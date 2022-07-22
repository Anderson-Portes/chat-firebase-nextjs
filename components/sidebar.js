import { Flex, Avatar, IconButton, Text, Button } from "@chakra-ui/react"
import { ArrowLeftIcon } from '@chakra-ui/icons'
import { signOut } from 'firebase/auth'
import { auth, db } from "../firebaseConfig"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, addDoc } from "firebase/firestore"
import getOtherEmail from "../utils/getOtherEmail"
import { useRouter } from 'next/router'

export default function Sidebar() {
  const [user] = useAuthState(auth)
  const [snapshot, loading, error] = useCollection(collection(db, "chats"))
  const router = useRouter()
  const redirect = id => {
    router.push(`/chat/${id}`)
  }
  const chats = snapshot?.docs.map(doc => ({id: doc.id, ...doc.data()}))
  const chatList = () => {
    return (
      chats?.filter(chat => chat.users.includes(user.email))
      .map(chat => (
        <Flex key={Math.random()} p={3} _hover={{bg: 'gray.200', cursor: 'pointer'}} align="center"
          onClick={() => redirect(chat.id)}>
          <Avatar src="" marginEnd={3}/>
          <Text>{getOtherEmail(chat.users, user)}</Text>
        </Flex>
      ))
    )
  }
  const chatExists = email => chats?.find(chat => chat.users.includes(user.email) && chat.users.includes(email))
  const newChat = async () => {
    const input = prompt("Enter email of chat recipient")
    if(!chatExists(input) && input !== user.email)
      await addDoc(collection(db, "chats"), { users: [user.email, input] })
  }

  return (
    <Flex w="300px" borderEnd="1px solid" borderColor="gray.200"
      direction="column" h="100%">
      <Flex h="81px" w="100%" align="center" justifyContent="space-between" p={3}
        borderBottom="1px solid" borderColor="gray.200">
        <Flex align="center">
          <Avatar src={user.photoURL} marginEnd={3}/>
          <Text>{user.displayName}</Text>
        </Flex>
        <IconButton icon={<ArrowLeftIcon />} size="sm" isRound onClick={() => signOut(auth)}/>
      </Flex>
      <Button m={5} p={4} onClick={() => newChat()}>New Chat</Button>
      <Flex direction="column" overflowX="scroll" sx={{
        '&::-webkit-scrollbar': {
          width: '0'
        }
      }} flex={1}>
        {chatList()}
      </Flex>
    </Flex>
  )
}