import { useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { prisma } from "../../prismaClient";
import { useEffect } from "react";

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

  return json({ success: true, user: newUser });
};

export default function NewUser() {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      console.log("User created successfully");
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post" className="space-y-4">
      {fetcher.data && fetcher.data.error && (
        <p className="mt-2 text-sm text-red-600">{fetcher.data.error}</p>
      )}
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
        disabled={fetcher.state === "submitting"}
      >
        {fetcher.state === "submitting" ? "Creating..." : "Create"}
      </button>
    </fetcher.Form>
  );
}
