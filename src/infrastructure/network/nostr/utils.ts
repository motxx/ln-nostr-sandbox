import { bech32 } from "bech32";

export const toLnurlPayStaticEndpoint = (nip05Id: string) => {
  const [name, domain] = nip05Id.split("@");
  if (!name || !domain) {
    throw new Error("Invalid nip05Id");
  }
  return `https://${domain}/.well-known/lnurlp/${name}`;
};

export const toLnurlPayUrl = (staticEndpoint: string) => {
  const data = new TextEncoder().encode(staticEndpoint);
  const words = bech32.toWords(data);
  return bech32.encode("lnurl", words);
};

export const unixtime = () => {
  return Math.floor(Date.now() / 1000);
};
