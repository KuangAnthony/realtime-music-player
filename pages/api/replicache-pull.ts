import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const pull = req.body;
  console.log(`Processing pull`, JSON.stringify(pull));
  const t0 = Date.now();

  try {
    const lastMutationID =
      Number(
        (
          await prisma.replicacheClient.findFirst({
            where: {
              id: pull.clientID,
            },
          })
        )?.last_mutation_id
      ) ?? 0;
    const changed = await prisma.message.findMany({
      where: {
        version: {
          gt: parseInt(pull.cookie ?? 0),
        },
      },
    });

    const cookie = Number(
      (
        await prisma.message.aggregate({
          _max: {
            version: true,
          },
        })
      )._max.version
    );
    console.log({ cookie, lastMutationID, changed });

    const patch = [];
    if (pull.cookie === null) {
      patch.push({
        op: 'clear',
      });
    }

    patch.push(
      ...changed.map((row) => ({
        op: 'put',
        key: `message/${row.id}`,
        value: {
          from: row.from,
          content: row.content,
          order: Number(row.order),
        },
      }))
    );

    res.json({
      lastMutationID,
      cookie,
      patch,
    });
    res.end();
  } catch (e: any) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log('Processed pull in', Date.now() - t0);
  }
};
