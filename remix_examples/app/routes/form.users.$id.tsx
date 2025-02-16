import { useLoaderData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { prisma } from "../../prismaClient";

export const loader = async ({ params }) => {
  console.log("form.users.$id.tsx loader");
  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  console.log(`User found loader: ${JSON.stringify(user)}`);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ user });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const id = parseInt(formData.get("id"));
  const name = formData.get("name");
  const email = formData.get("email");

  if (name === "") {
    console.log(`Error: Name is required`);
    return json({ success: false, error: "Name is required" }, { status: 400 });
  }

  console.log(`Updating user ${id} with name: ${name}, email: ${email}`);
  await prisma.user.update({
    where: { id },
    data: { name, email },
  });
  return redirect(`/form/users/${id}`);
};

export default function EditUser() {
  const { user } = useLoaderData();

  return (
    <Form method="post" className="space-y-4" action={`/form/users/${user.id}`}>
      <input type="hidden" name="id" value={user.id} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          defaultValue={user.name}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={user.email}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Update
      </button>
    </Form>
  );
}
