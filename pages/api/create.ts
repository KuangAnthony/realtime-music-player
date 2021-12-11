import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import argon2 from "argon2";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { password, username } = req.body;
    if (!password || !username) return;

    const session = await prisma.session.create({
      data: {
        password: await argon2.hash(password),
        current_song: null,
        owner: username,
        isPlaying: false,
        joined_users: [],
        queue: [],
      },
    });

    // STORE JWT IN COOKIES AND SEND IT TO CLIENT SO THAT ITS ACCESSIBLE TO CLIENT 
    // (SEE create.tsx LINE 26)
    // HERE IS THE JWT PAYLOAD
    // sign(
    //   { username, session: session.id },
    //   process.env.JWT_SECRET as string,
    //   { expiresIn: "7d" }
    // );

    return res.status(200).json({ session });
  } catch (e: any) {
    console.error(e);
    res.status(500).send(e.toString());
  }
};
