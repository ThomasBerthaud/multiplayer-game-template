import Hashids from 'hashids';

export type NumberLike = bigint | number;

// TODO should be an env variable
const hashids = new Hashids('34DGF34F43Bbdf234', 5);

export const encodeHash = hashids.encode.bind(hashids);
export const decodeHash = hashids.decode.bind(hashids);
