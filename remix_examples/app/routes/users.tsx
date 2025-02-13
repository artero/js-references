import { useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";

export const loader = async () => {
  const users = [
    { id: 1, name: "User One", email: "userone@example.com" },
    { id: 2, name: "User Two", email: "usertwo@example.com" },
    { id: 3, name: "User Three", email: "userthree@example.com" },
  ];
  return json({ users });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const name = formData.get("name");
  const email = formData.get("email");

  // Simula la actualización del usuario
  console.log(`Updating user ${id} with name: ${name}, email: ${email}`);

  return json({ success: true });
};

export default function Users() {
  const { users } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUsers, setUpdatedUsers] = useState(users);

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      const updatedUser = {
        ...selectedUser,
        name: fetcher.formData.get("name"),
        email: fetcher.formData.get("email"),
      };
      setUpdatedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setSelectedUser(null); // Clear the selected user after update
    }
  }, [fetcher.data]);

  return (
    <div className="flex">
      <div className="w-1/3">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {updatedUsers.map((user) => (
            <li key={user.id} className="mb-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => handleEditClick(user)}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3">
        {selectedUser && (
          <fetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="id" value={selectedUser.id} />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={selectedUser.name}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={selectedUser.email}
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
        )}
      </div>
    </div>
  );
}
