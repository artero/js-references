import { json } from "@remix-run/node";
import { prisma } from "../../prismaClient";

export const action = async ({ params }) => {
  const userId = parseInt(params.id);

  await prisma.user.delete({
    where: { id: userId },
  });

  return json({ success: true, id: userId });
};
