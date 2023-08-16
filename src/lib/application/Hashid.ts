import Hashids from 'hashids';
import { HASH_SALT } from '$env/static/private';

export type NumberLike = bigint | number;

const hashids = new Hashids(HASH_SALT, 5);

export const encodeHash = hashids.encode.bind(hashids);
export const decodeHash = hashids.decode.bind(hashids);
