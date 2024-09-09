import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Users, X, Share2, MessageCircle, Paperclip, Smile, Moon, Sun } from "lucide-react";
import { useToast } from "../hooks/use-toast"
import { initSocket } from '../utils/socket'
import ACTIONS from '../Actions';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { useTheme } from "next-themes"
import EmojiPicker from 'emoji-picker-react'
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from 'react-router-dom';
import Editor from './Editor'
function CollaborativeCodeEditor({ initialUsers, initialCode }) {
  const [users, setUsers] = useState(initialUsers)
  const [code, setCode] = useState(initialCode)
  const [cursors, setCursors] = useState({})
  const [groupCode] = useState('ABC123') // Simulated group code
  const { toast } = useToast()
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Alice', message: 'Hey everyone, I just joined!' },
    { id: 2, user: 'Bob', message: 'Welcome Alice! I\'ve updated the main function.' },
    { id: 3, user: 'Charlie', message: 'Looks good, I\'ll work on the error handling.' },
    { id: 4, user: 'System', message: 'Alice joined the group' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef(null)
  const chatScrollRef = useRef(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate cursor movements
      const newCursors = {}
      users.forEach(user => {
        newCursors[user.id] = {
          line: Math.floor(Math.random() * code.split('\n').length),
          ch: Math.floor(Math.random() * 40)
        }
      })
      setCursors(newCursors)
    }, 2000)

    return () => clearInterval(interval);
  }, [users, code])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleLeave = () => {
    // Implement actual leave logic here
    console.log("Leaving the group...")
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(groupCode).then(() => {
        toast({
          title: "Group code copied!",
          description: `The group code ${groupCode} has been copied to your clipboard.`,
        })
      }).catch(err => {
        console.error('Failed to copy: ', err)
        toast({
          title: "Failed to copy",
          description: "Please copy the group code manually: " + groupCode,
          variant: "destructive",
        })
      })
    } else {
      toast({
        title: "Clipboard not supported",
        description: "Please copy the group code manually: " + groupCode,
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { id: Date.now(), user: 'You', message: newMessage }])
      setNewMessage('')
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setChatMessages(
        prev => [...prev, { id: Date.now(), user: 'You', message: `Shared a file: ${file.name}` }]
      )
    }
  }

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
      const init = async () => {
          socketRef.current = await initSocket();
          socketRef.current.on('connect_error', (err) => handleErrors(err));
          socketRef.current.on('connect_failed', (err) => handleErrors(err));

          function handleErrors(e) {
              console.log('socket error', e);
              toast.error('Socket connection failed, try again later.');
              reactNavigator('/');
          }

          socketRef.current.emit(ACTIONS.JOIN, {
              roomId,
              username: location.state?.username,
          });

          // Listening for joined event
          socketRef.current.on(
              ACTIONS.JOINED,
              ({ clients, username, socketId }) => {
                  if (username !== location.state?.username) {
                      toast.success(`${username} joined the room.`);
                      console.log(`${username} joined`);
                  }
                  setClients(clients);
                  socketRef.current.emit(ACTIONS.SYNC_CODE, {
                      code: codeRef.current,
                      socketId,
                  });
              }
          );

          // Listening for disconnected
          socketRef.current.on(
              ACTIONS.DISCONNECTED,
              ({ socketId, username }) => {
                  toast.success(`${username} left the room.`);
                  setClients((prev) => {
                      return prev.filter(
                          (client) => client.socketId !== socketId
                      );
                  });
              }
          );
      };
      init();
      return () => {
          socketRef.current?.disconnect();
          socketRef.current?.off(ACTIONS.JOINED);
          socketRef.current?.off(ACTIONS.DISCONNECTED);
      };
  }, []);

  async function copyRoomId() {
      try {
          await navigator.clipboard.writeText(roomId);
          toast.success('Room ID has been copied to your clipboard');
      } catch (err) {
          toast.error('Could not copy the Room ID');
          console.error(err);
      }
  }

  function leaveRoom() {
      reactNavigator('/');
  }

  if (!location.state) {
      return <Navigate to="/collabcode" />;
  }
  return (
    (<div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-muted p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Group Members</h2>
          <Users className="h-5 w-5" />
        </div>
        <ScrollArea className="flex-grow">
          {clients.map(client => (
            <div key={client.socketId} className="flex items-center mb-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={client.username} />
                <AvatarFallback>{client.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span>{client.username}</span>
            </div>
          ))}
        </ScrollArea>
        <Button variant="destructive" className="mt-4" onClick={handleLeave}>
          Leave Group
        </Button>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="bg-muted p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Collaborative Coding Group</h1>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Group Code
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={leaveRoom}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Code Editor */}
        <Card className="flex-grow m-4 overflow-hidden flex flex-col">
          {/* <CardHeader className="py-2">
            <CardTitle>Code Editor</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0">
            <ScrollArea className="h-full">
              <div className="font-mono text-sm bg-muted p-4">
                {code.split('\n').map((line, index) => (
                  <div key={index} className="relative">
                    {line}
                    {Object.entries(cursors).map(([userId, cursor]) => {
                      const user = users.find(u => u.id === parseInt(userId))
                      if (user && cursor.line === index) {
                        return (
                          (<div
                            key={userId}
                            className="absolute top-0 w-0.5 h-5"
                            style={{
                              left: `${cursor.ch * 8}px`,
                              backgroundColor: user.color,
                            }}>
                            <div
                              className="absolute top-5 left-0 bg-background text-foreground text-xs p-1 rounded whitespace-nowrap">
                              {user.name}
                            </div>
                          </div>)
                        );
                      }
                      return null
                    })}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent> */}
           <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
        </Card>

        {/* Floating Chat Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
              size="icon">
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Open chat</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Chat & Activity</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[50vh] w-full pr-4" ref={chatScrollRef}>
              {chatMessages.map((msg) => (
                <div key={msg.id} className="mb-4">
                  <div className="font-semibold">{msg.user}</div>
                  <div>{msg.message}</div>
                </div>
              ))}
            </ScrollArea>
            <div className="mt-4 flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
              <Button
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current.click()}>
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }} />
              <Button
                size="icon"
                variant="outline"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile className="h-4 w-4" />
                <span className="sr-only">Add emoji</span>
              </Button>
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} theme={theme} />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>)
  );
}

CollaborativeCodeEditor.propTypes = {
  initialUsers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
  initialCode: PropTypes.string.isRequired,
}

CollaborativeCodeEditor.defaultProps = {
  initialUsers: [
    { id: 1, name: 'Alice Johnson', color: '#FF5733' },
    { id: 2, name: 'Bob Smith', color: '#33FF57' },
    { id: 3, name: 'Charlie Brown', color: '#3357FF' },
  ],
  initialCode: 'function example() {\n  console.log("Hello, collaborative coding!");\n}',
}

export default CollaborativeCodeEditor