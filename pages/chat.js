import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {

    const [message, setMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([]);
    const maxId = messageList.reduce((prev, curr) => prev = prev > curr.id ? prev : curr.id, 0);

    React.useEffect(() => {
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setMessageList(data);
            });
    }, []);

    function handleNewMessage(newMessage) {
        const message = {
            from: 'crtsms',
            text: newMessage,
        };

        supabaseClient
            .from('messages')
            .insert(message)
            .then(({ data }) => {
                setMessageList([
                    data[0],
                    ...messageList
                ])
            });

        setMessageList([
            message,
            ...messageList,
        ]);
        setMessage('');
    }

    function handleDeleteMessage(messageId) {
        const messageListFiltered = messageList.filter(m => m.id != messageId);
        setMessageList([...messageListFiltered]);
    }

    return (
        <Box
            styleSheet={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://www.crislei.dev/images/jumbotron.jpg)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList messages={messageList} deleteMessageHandler={handleDeleteMessage} />
                    <Box
                        as="form"
                        styleSheet={{
                            marginRight: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            with: '100%',
                            border: '0',
                            resize: 'none',
                            borderRadius: '5px',
                            padding: '2px 4px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
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
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            type='submit'
                            label='Send'
                            iconName='FaCheck'
                            size='lg'
                            styleSheet={{
                                border: '0',
                                resize: 'none',
                                borderRadius: '3px',
                                padding: '1px 1px',
                                height: '45px',
                                width: '100px'
                            }}
                            onClick={function (event) {
                                event.preventDefault();
                                handleNewMessage(message);
                            }}
                            buttonColors={{
                                constrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],

                            }}
                        />

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            width: '90%',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                width: '100%',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box>
                                <Box
                                    styleSheet={{
                                        width: '100%',
                                        marginBottom: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'left'
                                    }}
                                >
                                    <Image
                                        styleSheet={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                            marginRight: '8px',
                                        }}
                                        src={`https://github.com/${message.from}.png`}
                                    />
                                    <Text tag="strong">
                                        {message.from}
                                    </Text>
                                    <Text
                                        styleSheet={{
                                            fontSize: '10px',
                                            marginLeft: '8px',
                                            color: appConfig.theme.colors.neutrals[300],
                                        }}
                                        tag="span"
                                    >
                                        {(new Date().toLocaleDateString())}
                                    </Text>
                                </Box>
                                {message.text}
                            </Box>
                            <Box>
                                <Button
                                    fullWidth='false'
                                    type='button'
                                    iconName='FaTimes'
                                    variant='tertiary'
                                    colorVariant='negative'
                                    onClick={function (event) {
                                        event.preventDefault();
                                        props.deleteMessageHandler(message.id);
                                    }}
                                >
                                </Button>
                            </Box>
                        </Box>
                    </Text>
                );
            })}
        </Box>
    )
}