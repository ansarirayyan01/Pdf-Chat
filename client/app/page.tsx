import FilUploadComponent from "./components/fil-upload";
import Chat from "./components/chat";

export default function Home() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="bg-black shadow-md border-b border-red-800">
        <div className="w-screen mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-red-700">PDF Chat App</div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-red-500">Home</a>
            <a href="#" className="text-white hover:text-red-500">Features</a>
            <a href="#" className="text-white hover:text-red-500">Contact</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-screen">
        {/* Upload Section */}
        <div className="md:w-1/3 p-6 flex justify-center items-center border-r border-red-800">
          <FilUploadComponent />
        </div>

        {/* Chat Section */}
        <div className="md:w-2/3 p-6">
          <Chat />
        </div>
      </div>
    </div>
  );
}
