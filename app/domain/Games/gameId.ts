import { NumberLike } from 'hashids/util';
import { decodeHash, encodeHash } from '~/application/Hashid';

export function getGameId(gameCode: string): NumberLike {
    return decodeHash(gameCode)[0];
}

export function getGameCode(gameId: NumberLike): string {
    return encodeHash(gameId.toString());
}
