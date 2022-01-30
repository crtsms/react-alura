import { TextField, Button } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'
import { MessageList } from '../src/components/MessageList'
import { Header } from '../src/components/Header'
import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getMessagesFromDb(handleNewMessageDelegate) {
    return supabaseClient
        .from('messages')
        .on('INSERT', (incoming) => {
            handleNewMessageDelegate(incoming.new);
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

        const subscription = getMessagesFromDb((incoming) => {
            setMessageList((currentListValue) => {
                return [
                    ...currentListValue,
                    incoming
                ]
            });
            scrollToBottom();
        });       

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    function handleNewMessage(newMessage) {
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
        const messageListFiltered = messageList.filter(m => m.id != messageId);
        setMessageList([...messageListFiltered]);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: appConfig.theme.colors.neutrals[100],
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100vh'
            }}
        >
            <Header user={user} />
            <Box sx={{
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100vh',
                padding: '0.5rem',
                paddingTop: '0',
                overflowX: 'hidden',
            }}>
                {messageList.length > 0 ? (
                    <MessageList messages={messageList} onDeleteClick={handleDeleteMessage} />
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
                    display: 'flex',
                    alignItems: 'center',
                    with: '100%',
                    border: '0',
                    resize: 'none',
                    padding: '0.2rem',
                    backgroundColor: appConfig.theme.colors.neutrals[500],
                    color: appConfig.theme.colors.neutrals[200],
                }}
                onSubmit={function (event) {
                    event.preventDefault();
                    handleNewMessage(message);
                }}
            >
                <TextField
                    value={message}
                    onChange={(event) => {
                        const valor = event.target.value;
                        setMessage(valor);
                    }}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleNewMessage(message);
                        }
                    }}
                    placeholder="Start writting a new message ..."
                    type="textarea"
                    styleSheet={{
                        width: '100%',
                        border: '0',
                        resize: 'none',
                        backgroundColor: appConfig.theme.colors.neutrals[500],
                        marginRight: '0.5rem',
                        color: appConfig.theme.colors.neutrals[200],
                    }}
                />           

                <ButtonSendSticker onStickerClick={(sticker) => {
                    handleNewMessage(':sticker: ' + sticker);
                }}
                />
            </Box>
        </Box>
    )
}