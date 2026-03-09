
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
import { menu } from './lib/menu.js'
import { aiReply } from './lib/aiChat.js'
import { OWNER_NUMBER, OWNER_NAME, DEV_NAME, DEV_NUMBER, PREFIX } from './config.js'

let funbot = false

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("session")

const sock = makeWASocket({
auth: state,
printQRInTerminal: false,
logger: pino({ level: "silent"})
})

if(!sock.authState.creds.registered){

const code = await sock.requestPairingCode(OWNER_NUMBER)
console.log("PAIR CODE:", code)

}

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]
if(!msg.message) return

const from = msg.key.remoteJid
const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ""

if(text === PREFIX + "menu"){
await sock.sendMessage(from,{ text: menu })
}

if(text === PREFIX + "dev"){
await sock.sendMessage(from,{ text: `DEVELOPER: ${DEV_NAME}\nNUMBER: wa.me/${DEV_NUMBER}` })
}

if(text === PREFIX + "owner"){
await sock.sendMessage(from,{ text: `OWNER: ${OWNER_NAME}\nNUMBER: wa.me/${OWNER_NUMBER}` })
}

if(text === PREFIX + "funbot on"){
funbot = true
await sock.sendMessage(from,{ text: "AI Chat Enabled" })
}

if(text === PREFIX + "funbot off"){
funbot = false
await sock.sendMessage(from,{ text: "AI Chat Disabled" })
}

if(funbot && !text.startsWith(PREFIX)){
const reply = await aiReply(text)
await sock.sendMessage(from,{ text: reply })
}

})

}

startBot()
