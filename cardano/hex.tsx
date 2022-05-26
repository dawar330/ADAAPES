export default function fromHex(hex:any){ return Buffer.from(hex, "hex");}

export const toHex = (bytes:any) => Buffer.from(bytes).toString("hex");