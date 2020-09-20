import * as blake2 from "blake2"

export class NoGeneratorUtils {

  static getRandomArbitrary() {
    return (Math.random() * (999999 - 100000) + 100000).toFixed(0);
  }

  static async generateCode(): Promise<string>{
    let code = await this.getRandomArbitrary();
    code = code+Date.now().toString()
    const h = await blake2.createHash('blake2b', {digestLength: 3});
    await h.update(Buffer.from(code));
    return await h.digest("hex")
  }
}