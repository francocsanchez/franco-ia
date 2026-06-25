import { type Bot, type Context } from "grammy";

export type TelegramContext = Context;

export type TelegramBot = Bot<TelegramContext>;
