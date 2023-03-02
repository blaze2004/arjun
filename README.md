# Arjun
Arjun is an open source personal assistant designed for WhatsApp users to manage their schedule and get answers to general queries.

With natural language processing capabilities, users can send messages to Arjun and add events to their calendar, set reminders, and get general knowledge questions answered. 

Arjun brings the convenience of AI-powered tools to WhatsApp users.

## Getting Started
To get started locally, create a meta developer account and create an app and add whatsapp in the services of the app.

* Clone this repo locally
* Then create your environment variables. (Make sure to create a table named ```wa_bot_user_sessions``` in your postgresql database.)
```
cp .example.env .env
```
```
npm install
```
```
npm run dev
```
* Start developing.

## Abbreviations
WA or wa : WhatsApp