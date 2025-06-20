import React, { useEffect, useState } from 'react'
import useConversation from '../stateManage/useConversation.js'
import { BASE_URL, token } from '../config.js'

function useGetMessage() {
  const [loading, setLoading] = useState(false)
  const { messages, setMessages, selcetedConversation  } = useConversation()

    useEffect(() => {
    if (!selcetedConversation || !selcetedConversation._id) {
        console.log("No conversation selected, clearing messages and stopping loading");
      setMessages([])  // clear messages when no conversation selected
      setLoading(false)
      return
    }

  // useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      if (selcetedConversation && selcetedConversation._id) {
        try {
          const res = await fetch(`${BASE_URL}/api/message/get/${selcetedConversation._id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error('Failed to fetch messages');
          }
          const data = await res.json();
        
          setMessages(data.messages );

          // setLoading(false)

        } catch (error) {
          console.log("Error is useGetMessage:", error)
               setMessages([]);
        } finally {
      setLoading(false);
    }
       

      }
    }
    getMessages()

  }, [selcetedConversation, setMessages])

   

  return {
    messages, loading,
  }
}

export default useGetMessage


