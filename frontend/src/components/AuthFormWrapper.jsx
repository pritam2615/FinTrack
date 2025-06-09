export default function AuthFormWrapper({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
