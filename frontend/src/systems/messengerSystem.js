import {CHATS} from '../data/continuation.js';
// Saved chatPositions belong to the old interactive UI and never truncate an archive.
export const archivedConversation=id=>CHATS.find(chat=>chat.id===id)||null;
