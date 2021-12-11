import { NextApiRequest, NextApiResponse } from 'next';
import { ReadonlyJSONValue } from 'replicache';
import prisma from '../../lib/prisma';

type PushRequest = {
  clientID: string;
  mutations: Mutation[];
  pushVersion: number;
  schemaVersion: string;
};

type CreateMsgBody = {
  id: string;
  from: string;
  content: string;
  order: number;
};

type Mutation = {
  id: number;
  name: string;
  args: CreateMsgBody | ReadonlyJSONValue;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const push = req.body as PushRequest;
  console.log("Processing push", JSON.stringify(push));

  const t0 = Date.now();
  try {
    const v: [{ nextval: number }] =
      await prisma.$queryRaw`SELECT nextval('version')`;
    const { nextval: version } = v[0] as { nextval: number };
    let lastMutationID = await getLastMutationID(push.clientID);

    console.log("version", version, "lastMutationID:", lastMutationID);

    for (const mutation of push.mutations) {
      const t1 = Date.now();

      const expectedMutationID = Number(lastMutationID) + 1;

      if (mutation.id < expectedMutationID) {
        console.log(
          `Mutation ${mutation.id} has already been processed - skipping`
        );
      }
      if (mutation.id > expectedMutationID) {
        console.warn(`Mutation ${mutation.id} is from the future - aborting`);
        break;
      }

      console.log("Processing mutation:", JSON.stringify(mutation));

      switch (mutation.name) {
        case "createMessage":
          await createMessage(mutation.args as CreateMsgBody, version);
          break;
        default:
          throw new Error(`Unknown mutation: ${mutation.name}`);
      }

      lastMutationID = expectedMutationID;
      console.log("Processed mutation in", Date.now() - t1);
    }

    console.log(
      "setting",
      push.clientID,
      "last_mutation_id to",
      lastMutationID
    );

    await prisma.replicacheClient.update({
      where: {
        id: push.clientID,
      },
      data: {
        last_mutation_id: lastMutationID,
      },
    });
    res.send("{}");

    // We need to await here otherwise, Next.js will frequently kill the request
    // and the poke won't get sent.
    await sendPoke();
  } catch (e: any) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log("Processed push in", Date.now() - t0);
  }
};

async function getLastMutationID(clientID: string) {
  const query = await prisma.replicacheClient.findFirst({
    where: { id: clientID },
  });

  const clientRow = query?.last_mutation_id;
  if (clientRow) {
    return clientRow;
  }

  console.log('Creating new client', clientID);
  await prisma.replicacheClient.create({
    data: {
      id: clientID,
      last_mutation_id: 0,
    },
  });

  return 0;
}

async function createMessage(m: CreateMsgBody, version: number) {
  const { id, from, content, order } = m;
  await prisma.message.create({
    data: {
      id,
      from,
      content,
      order,
      version,
      session: 'soon-tm',
    },
  });
}

async function sendPoke() {
  // Not needed, we use Supabase Realtime here :)
}
