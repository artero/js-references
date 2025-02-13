import { json } from "@remix-run/node";

export const action = async ({ params }) => {
  const userId = parseInt(params.userId);

  // Simula la eliminación del usuario
  console.log(`Deleting user ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return json({ success: true, id: userId });
};
