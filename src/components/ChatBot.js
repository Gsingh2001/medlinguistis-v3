'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle clicks outside and scroll to close chat
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  const toggleOpen = () => setOpen((prev) => !prev);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((msgs) => [
      ...msgs,
      { id: Date.now(), sender: 'user', text: input.trim() },
    ]);
    setInput('');

    // Fake bot reply after 1.5s
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Thanks for your message! I am here to help.',
        },
      ]);
    }, 1500);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <Paper
          ref={chatRef}
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 72,
            right: 24,
            width: 320,
            height: 420,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: 6,
            zIndex: 1300,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Medlinguitis Chatbot
            </Typography>
            <IconButton
              size="small"
              onClick={toggleOpen}
              sx={{ color: 'primary.contrastText' }}
              aria-label="Close chat"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages List */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#f5f5f5',
            }}
          >
            <List>
              {messages.map(({ id, sender, text }) => (
                <ListItem
                  key={id}
                  sx={{
                    justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {sender === 'bot' && (
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>B</Avatar>
                    </ListItemAvatar>
                  )}
                  <ListItemText
                    primary={text}
                    sx={{
                      bgcolor: sender === 'user' ? 'primary.light' : 'grey.300',
                      color: sender === 'user' ? 'primary.contrastText' : 'text.primary',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: '75%',
                      wordBreak: 'break-word',
                    }}
                    primaryTypographyProps={{ fontSize: 14 }}
                  />
                  {sender === 'user' && (
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>U</Avatar>
                    </ListItemAvatar>
                  )}
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Input Area */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            sx={{
              display: 'flex',
              p: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TextField
              multiline
              maxRows={3}
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleInputKeyPress}
              sx={{ flexGrow: 1 }}
              size="small"
              autoFocus
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              aria-label="Send message"
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      )}

      {/* Chat Toggle Button */}
      <IconButton
        color="primary"
        onClick={toggleOpen}
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': { bgcolor: 'primary.dark' },
          boxShadow: 4,
          width: 56,
          height: 56,
          borderRadius: '50%',
          zIndex: 1300,
        }}
      >
        <ChatIcon fontSize="large" />
      </IconButton>
    </>
  );
};

export default Chatbot;
