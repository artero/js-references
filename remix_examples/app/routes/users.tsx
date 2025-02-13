import { Outlet, Link, useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";

export const loader = async () => {
  console.log("users.tsx loader");
  const users = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));
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
              <Link
                className="text-blue-500 hover:underline"
                to={`/users/${user.id}`}
              >
                {user.name}
              </Link>
              <fetcher.Form method="post" action={`/users/${user.id}/destroy`}>
                <button
                  type="submit"
                  className="text-red-500 hover:underline ml-4"
                >
                  Delete
                </button>
              </fetcher.Form>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3">
        <Outlet />
      </div>
    </div>
  );
}
