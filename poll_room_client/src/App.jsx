import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePoll from "./pages/CreatePoll";
import PollRoom from "./pages/PollRoom";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<PollRoom />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
