// React // Next
import React from 'react';
import { useRouter } from 'next/router'

// Librarys
import { Box, Text, TextField, Image, Button } from '@skynexui/components';

// Components
import { ButtonSendSticker } from '../src/components/buttonSendSticker.js'
import { MessageList } from '../src/components/MessageList'
import { Header } from '../src/components/Header'

// Style
import appConfig from '../config.json';
import styles from '../styles/glassMorphism.module.css'

// Database
import { createClient, SupabaseClient } from '@supabase/supabase-js'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzgxMTE1NywiZXhwIjoxOTU5Mzg3MTU3fQ.wfDaJbPrC2EILmZl8R7tHgeTxIeTFx7m-i_c1gMTJK0'
const SUPA_URL = 'https://jerfaxeghnnbhfxvvucu.supabase.co'
const dbSupaInteraction = createClient(SUPA_URL, SUPA_KEY)



export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('')
    const [messageList, setMessageList] = React.useState([])

    function listenerSupaBase(addMsg){
        return dbSupaInteraction
            .from('mesHis')
            .on('INSERT',(liveResponse) => {
                addMsg(liveResponse.new)
            })
            .subscribe()    
    } 
    
    
    const roteamento = useRouter()
    const loggedUser = roteamento.query.username

    // Por padrao o useeffect roda qnd a pagina carrega
    // Caso queira onChange basta colocar a variavel onchange na entrada secundaria array
    React.useEffect(() => {
        dbSupaInteraction.from('mesHis').select('*').order('id', { ascending: false }).then(({ data }) => {
            setMessageList(data);
        })
        listenerSupaBase((novaMensagem)=>{
            console.log('novamensagem: '+novaMensagem);
            setMessageList((realtimeListValue)=>{
                return [
                    novaMensagem, ...realtimeListValue,
                ]
            })
    }, [])
})


    function handleNewMessage(novaMensagem) {
        const mensagem = {
            id: messageList.length + 1,
            de: loggedUser,
            texto: novaMensagem,
            created_at: (new Date()).toLocaleDateString()
        }
        console.log(mensagem)
        dbSupaInteraction.from('mesHis').insert([mensagem])
        .then(({ data }) => {
            console.log('Resposta handleNewMessage:::: ' + data)
        })

        setMensagem('');

    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://cdna.artstation.com/p/assets/images/images/018/836/268/large/fajar-fazriansyah-master-10.jpg?1560916155)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                backgroundPosition: 'right',
                color: appConfig.theme.colors.neutrals['000'],
            }}
        >
            {/* Background chat */}
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    // backgroundColor: appConfig.theme.colors.neutrals[700],
                    transition: 0.2,
                    height: '100%',
                    maxWidth: '55%',
                    maxHeight: '75vh',
                    padding: '32px'
                }}
                className={styles.glassMorphismOutside}
            >
                <Header

                />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        // backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                    className={styles.glassMorphismInside}
                >

                    <MessageList messageList={messageList} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        value={messageList[0]}
                    >
                        <TextField
                            placeholder="Insira sua mensagem aqui..."
                            value={mensagem}
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
                            onChange={(event) => {
                                const valor = event.target.value
                                setMensagem(valor)
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNewMessage(mensagem);
                                }
                            }
                            }
                        />
                        <ButtonSendSticker
                        onStickerClick={(sticker)=>{
                          handleNewMessage(':stickerURL:'+sticker)
                        }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}