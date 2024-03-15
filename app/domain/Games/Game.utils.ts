import { MIN_PLAYERS } from '~/domain/Games/Game.constants';
import { User } from '~/domain/Users/User.types';

export function hasEnoughPlayers(game: { users: User[] }) {
    return game.users.length >= MIN_PLAYERS;
}
