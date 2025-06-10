import dynamic from 'next/dynamic';

// Prevent SSR for admin-only client code
const CreateUserForm = dynamic(() => import('@/components/Admin/CreateUserForm'), {
  ssr: false
});

export default function UsersAdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Create User</h1>
      <CreateUserForm />
    </main>
  );
}
