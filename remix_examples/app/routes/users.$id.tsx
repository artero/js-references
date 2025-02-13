import { useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect } from "react";

export const loader = async ({ params }) => {
  console.log("users.%24id.tsx loader");
  const users = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));
  console.log(parseInt(params.id));
  const user = users.find((user) => user.id === parseInt(params.id));

  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ user });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const name = formData.get("name");
  const email = formData.get("email");

  // Simula la actualización del usuario
  console.log(id, name, email);
  if (name === "") {
    console.log(`Error: Name is required`);
    return json({ success: false, error: "Name is required" }, { status: 400 });
  }

  console.log(`Updating user ${id} with name: ${name}, email: ${email}`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return json({ success: true });
};

export default function EditUser() {
  const { user } = useLoaderData();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      // Aquí puedes manejar la lógica después de la actualización
      console.log("User updated successfully");
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post" className="space-y-4">
      {fetcher.data && fetcher.data.error && (
        <p className="mt-2 text-sm text-red-600">{fetcher.data.error}</p>
      )}
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
        disabled={fetcher.state === "submitting"}
      >
        {fetcher.state === "submitting" ? "Updating..." : "Update"}
      </button>
    </fetcher.Form>
  );
}
