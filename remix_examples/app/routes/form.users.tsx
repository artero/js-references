import {
  Outlet,
  Link,
  useLoaderData,
  useParams,
  useFetcher,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { prisma } from "../../prismaClient";

export const loader = async () => {
  console.log("users.tsx loader");
  const users = await prisma.user.findMany();

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
  const params = useParams();
  const fetcher = useFetcher();

  return (
    <div className="flex">
      <div className="w-1/3">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-2">
              <Link
                className="text-blue-500 hover:underline"
                to={`/form/users/${user.id}`}
              >
                {user.name}
              </Link>
              <fetcher.Form
                method="post"
                action={`/form/users/${user.id}/destroy`}
              >
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
        <Link
          to="/form/users/new"
          className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add New User
        </Link>
      </div>
      <div className="w-2/3">
        <Outlet key={params.id || "new"} />
      </div>
    </div>
  );
}
