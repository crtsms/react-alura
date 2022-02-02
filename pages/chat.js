import { TextField } from '@skynexui/components';
import React from 'react';
import { Router, useRouter } from 'next/router';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'
import { MessageList } from '../src/components/MessageList'
import { Header } from '../src/components/Header'
import { Box } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function handleGetNewMessage(getNewMessageCallback) {
    return supabaseClient
        .from('messages')
        .on('*', (incoming) => {
            getNewMessageCallback(incoming);
        })
        .subscribe();
}

export default function ChatPage() {
    const route = useRouter();
    const user = route.query.username
    const [message, setMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([]);    
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      };

    React.useEffect(() => {
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: true })
            .then(({ data }) => {
                setMessageList(data);
            });

        const subscriptionNewMessage = handleGetNewMessage((incoming) => {
            console.log(incoming);

            if(incoming.eventType === 'INSERT'){
                setMessageList((currentListValue) => {
                    return [
                        ...currentListValue,
                        incoming.new
                    ]
                });
            }else if(incoming.eventType === 'DELETE'){                
                setMessageList((currentListValue) => {                    
                    const messageListFiltered = currentListValue.filter(m => m.id != incoming.old.id);
                    return [...messageListFiltered]
                });    
            }
        });           

        return () => {
            subscriptionNewMessage.unsubscribe();            
        }        
    }, []);

    function handlePostMessage(newMessage) {
        const message = {
            from: user,
            text: newMessage,
        };

        supabaseClient
            .from('messages')
            .insert(message)
            .then();

        setMessage('');
        scrollToBottom();
    }

    function handleDeleteMessage(messageId) {

        supabaseClient
            .from('messages')
            .delete()
            .match({ 'id' : messageId})
            .then();        
    }

    return (
        <Stack
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: appConfig.theme.colors.neutrals[100],
                maxWidth: '100%',
                marginTop: '3rem',
                marginBlockEnd: '5rem'
            }}
        >
            <Header user={user} />
            <Box sx={{
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100vh',
                padding: '0.5rem',
                overflowX: 'hidden',
                flex: 2
            }}>
                {messageList.length > 0 ? (
                    <MessageList messages={messageList} onDeleteClick={handleDeleteMessage} onLoad={scrollToBottom} />
                ) : (
                    <Stack alignItems="center" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        maxWidth: '100%',
                        maxHeight: '100vh',                        
                    }}>
                        <CircularProgress sx={{color: appConfig.theme.colors.primary[400]}} />
                    </Stack>                        
                )}
                <Box ref={messagesEndRef} />
            </Box>
            <Box
                as="form"
                sx={{
                    position: 'fixed', 
                    bottom: 0,                   
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '5rem',
                    maxHeight: '5rem',
                    border: '0',
                    resize: 'none',
                    padding: '0.2rem',
                    backgroundColor: appConfig.theme.colors.neutrals[500],
                    color: appConfig.theme.colors.neutrals[200],
                }}
                onSubmit={function (event) {
                    event.preventDefault();
                    handlePostMessage(message);
                }}
            >
                <TextField
                    value={message}
                    onChange={(event) => {
                        const valor = event.target.value;
                        setMessage(valor);
                    }}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter' && message !== '') {
                            event.preventDefault();
                            handlePostMessage(message);
                        }
                    }}
                    placeholder="Start writting a new message ..."
                    type="textarea"
                    styleSheet={{
                        width: '100%',
                        border: '0',
                        resize: 'none',
                        fontSize: '1rem',
                        bottom: 0, 
                        left: 0, 
                        right: 0,
                        backgroundColor: appConfig.theme.colors.neutrals[500],
                        color: appConfig.theme.colors.neutrals[100],
                    }}
                />      
                <IconButton aria-label='send' 
                    sx={{ color: appConfig.theme.colors.primary[400] }} 
                    onClick={(event) => {
                        if (message !== '') {
                            event.preventDefault();
                            handlePostMessage(message);
                        }
                    }}
                >
                    <SendIcon />
                </IconButton>                     

                <ButtonSendSticker onStickerClick={(sticker) => {
                    handlePostMessage(':sticker: ' + sticker);
                }}
                />
            </Box>
        </Stack>
    )
}