import React from "react";
import { NostrClient, connectNostr } from "./services/nostr-client";

let nostr: NostrClient | null = null;

function App() {
  return (
    <div className="App" role="main">
      <article className="App-article">
        <h3>NWA (Nostr Wallet Auth) Sample</h3>
        <button onClick={async () => nostr = await connectNostr()}>Connect Nostr</button>
        <button onClick={async () => await nostr!.signEvent()}>Sign Event</button>
      </article>
    </div>
  );
}
export default App;
