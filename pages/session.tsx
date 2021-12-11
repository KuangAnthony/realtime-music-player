import React, { useEffect, useRef, useState } from 'react';
import { Replicache } from 'replicache';
import { useSubscribe } from 'replicache-react';
import { nanoid } from 'nanoid';
import { RealtimeClient } from '@supabase/realtime-js';

export default function Home() {
  const [rep, setRep] = useState<Replicache | null>(null);

  useEffect(() => {
    const r = new Replicache({
      pushURL: '/api/replicache-push',
      pullURL: '/api/replicache-pull',
      mutators: {
        async createMessage(tx, { id, from, content, order }) {
          await tx.put(`message/${id}`, {
            from,
            content,
            order,
          });
        },
      },
    });
    listen(r);
    setRep(r);
  }, []);

  return rep && <Chat rep={rep} />;
}

function Chat({ rep }: { rep: Replicache }) {
  const messages = useSubscribe(
    rep,
    async (tx) => {
      // Note: Replicache also supports secondary indexes, which can be used
      // with scan. See:
      // https://js.replicachedev/classes/replicache.html#createindex
      const list = await tx.scan({ prefix: 'message/' }).entries().toArray();
      list.sort(([, { order: a }], [, { order: b }]) => a - b);
      return list;
    },
    []
  );

  const usernameRef = useRef();
  const contentRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    const last = messages.length && messages[messages.length - 1][1];
    const order = (last?.order ?? 0) + 1;
    rep.mutate.createMessage({
      id: nanoid(),
      from: usernameRef.current.value,
      content: contentRef.current.value,
      order,
    });
    contentRef.current.value = '';
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={onSubmit}>
        <input ref={usernameRef} style={styles.username} required />
        says:
        <input ref={contentRef} style={styles.content} required />
        <input type="submit" />
      </form>
      <MessageList messages={messages} />
    </div>
  );
}

function MessageList({ messages }) {
  return messages.map(([k, v]) => (
    <div key={k}>
      <b>{v.from}: </b>
      {v.content}
    </div>
  ));
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
    marginBottom: '1em',
  },
  username: {
    flex: 0,
    marginRight: '1em',
  },
  content: {
    flex: 1,
    maxWidth: '30em',
    margin: '0 1em',
  },
};

function listen(rep: Replicache) {
  const socket = new RealtimeClient(
    process.env.REALTIME_URL || 'ws://localhost:4000/socket'
  );
  socket.connect();

  // TODO: Filter events as needed
  const channel = socket.channel('realtime:*');
  channel.on('*', (msg) => {
    // TODO: There's probably a more efficient way to apply changes since we know what was changed
    console.log(msg);
    rep.pull();
  });
  channel.subscribe().receive('ok', () => {
    console.log('Connected!');
  });
}
