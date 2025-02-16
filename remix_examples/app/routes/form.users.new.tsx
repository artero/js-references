import { Form, redirect, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { prisma } from "../../prismaClient";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  if (!name || !email) {
    return json(
      { success: false, error: "Name and email are required" },
      { status: 400 }
    );
  }

  const newUser = await prisma.user.create({
    data: { name, email },
  });

  if (!newUser) {
    return json(
      { success: false, error: "Error creating user" },
      { status: 500 }
    );
  }

  return redirect(`/form/users/${newUser.id}`);
};

export default function NewUser() {
  return (
    <Form method="post" className="space-y-4" action="/form/users/new">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Create
      </button>
    </Form>
  );
}
