import { modInv } from 'bigint-mod-arith'

export class Permutation {
    constructor(N, C, I) {
        this.N = BigInt(N)
        this.C = BigInt(C)
        this.I = I ?? modInv(C, N)

        console.log(`N: ${this.N.toString()}`)
        console.log(`C: ${this.C.toString()}`)
        console.log(`I: ${this.I.toString()}`)
    }    

    f(n) {
        return (BigInt(n) * this.C) % this.N
    }

    f_inv(n) {
        return (BigInt(n) * this.I) % this.N
    }
}