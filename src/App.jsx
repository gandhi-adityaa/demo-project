import "./App.css";
import CinemaSeatBooking from "../src/components/cinema-seat-booking";
import UserTable from "../src/components/UserTable";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 space-y-8">
        <CinemaSeatBooking />
        <UserTable />
      </div>
    </div>
  );
}

export default App;
