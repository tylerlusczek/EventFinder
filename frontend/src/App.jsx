import { useEffect, useState } from "react";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import ClubList from "./components/ClubList";
import YourEventsList from "./components/YourEventsList";
import UsersList from "./components/UsersList";
import UserForm from "./components/UserForm";
import AccountInfo from "./components/AccountInfo";
import AuthPanel from "./components/AuthPanel";
import "./app.css";
import {
  getEvents,
  getClubs,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  login,
  signup,
  changePassword,
  joinClub,
  leaveClub,
  createClub,
  deleteClub,
  getUsers,
  createUser,
  updateUser,
  rsvpEvent,
  cancelRsvp,
} from "./api";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authMessage, setAuthMessage] = useState("");
  const [authMessageType, setAuthMessageType] = useState("error");
  const [currentTab, setCurrentTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const loadClubs = async () => {
    try {
      const data = await getClubs();
      setClubs(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const loadMyEvents = async () => {
    try {
      const data = await getMyEvents();
      setMyEvents(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      loadEvents();
      loadClubs();
      if (user.isAdmin) {
        loadUsers();
      } else {
        loadMyEvents();
      }
    }
  }, [user]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      setAuthMessage("Login successful");
      setAuthMessageType("success");
      setMessage("");
    } catch (err) {
      setAuthMessage(err.message);
      setAuthMessageType("error");
      throw err;
    }
  };

  const handleSignup = async (newUser) => {
    try {
      const response = await signup(newUser);
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      setAuthMessage("Account created successfully");
      setAuthMessageType("success");
      setMessage("");
    } catch (err) {
      setAuthMessage(err.message);
      setAuthMessageType("error");
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthMessage("Logged out successfully");
    setAuthMessageType("success");
    setCurrentTab("events");
    setEvents([]);
    setClubs([]);
    setMyEvents([]);
    setUsers([]);
    setSelectedEvent(null);
    setSelectedUser(null);
    setMessage("");
  };

  const handlePasswordChange = async (payload) => {
    try {
      await changePassword(payload);
      setAuthMessage("Password updated successfully");
      setAuthMessageType("success");
    } catch (err) {
      setAuthMessage(err.message);
      setAuthMessageType("error");
      throw err;
    }
  };

  const handleCreateOrUpdateEvent = async (event) => {
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent.id, event);
        setMessage("Event updated successfully");
      } else {
        await createEvent(event);
        setMessage("Event created successfully");
      }
      setSelectedEvent(null);
      loadEvents();
      loadMyEvents();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setMessage("Event deleted successfully");
      setSelectedEvent(null);
      loadEvents();
      loadMyEvents();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setCurrentTab("events");
  };

  const handleJoinClub = async (orgId) => {
    try {
      await joinClub(orgId);
      setMessage("Club joined successfully");
      loadClubs();
      loadEvents(); // Reload events since membership changed
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLeaveClub = async (orgId) => {
    try {
      await leaveClub(orgId);
      setMessage("Club left successfully");
      loadClubs();
      loadEvents(); // Reload events since membership changed
      loadMyEvents();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleCreateClub = async (club) => {
    try {
      await createClub(club);
      setMessage("Club added successfully");
      loadClubs();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteClub = async (orgId) => {
    try {
      await deleteClub(orgId);
      setMessage("Club deleted successfully");
      loadClubs();
      loadEvents();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleRsvp = async (eventId) => {
    try {
      await rsvpEvent(eventId);
      setMessage("RSVP saved successfully");
      loadMyEvents();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleCancelRsvp = async (eventId) => {
    try {
      await cancelRsvp(eventId);
      setMessage("RSVP cancelled successfully");
      loadMyEvents();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleCreateOrUpdateUser = async (user) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, user);
        setMessage("User updated successfully");
      } else {
        await createUser(user);
        setMessage("User created successfully");
      }
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!user) {
    return (
      <div className="auth-page">
        <AuthPanel
          user={user}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onLogout={handleLogout}
          onPasswordChange={handlePasswordChange}
          authMessage={authMessage}
          authMessageType={authMessageType}
        />
      </div>
    );
  }

  const registeredEventIds = new Set(myEvents.map((event) => event.id));
  const rsvpStatusById = Object.fromEntries(myEvents.map((event) => [event.id, event.rsvp_status]));

  return (
    <div className="page-wrapper">
      <header className="header-card">
        <div>
          <h1>Event Finder</h1>
          <p className="welcome-text">Welcome, {user.first_name}{user.isAdmin ? " (Admin)" : ""}</p>
        </div>
        <button type="button" className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <nav className="tab-bar">
        <button className={"tab" + (currentTab === "clubs" ? " active" : "")} aria-current={currentTab === "clubs" ? "page" : undefined} onClick={() => setCurrentTab("clubs")}>Clubs</button>
        <button className={"tab" + (currentTab === "events" ? " active" : "")} aria-current={currentTab === "events" ? "page" : undefined} onClick={() => setCurrentTab("events")}>Events</button>
        {user.isAdmin ? (
          <button className={"tab" + (currentTab === "users" ? " active" : "")} aria-current={currentTab === "users" ? "page" : undefined} onClick={() => setCurrentTab("users")}>Users</button>
        ) : (
          <button className={"tab" + (currentTab === "your-events" ? " active" : "")} aria-current={currentTab === "your-events" ? "page" : undefined} onClick={() => setCurrentTab("your-events")}>Your Events</button>
        )}
        <button className={"tab" + (currentTab === "account" ? " active" : "")} aria-current={currentTab === "account" ? "page" : undefined} onClick={() => setCurrentTab("account")}>Account</button>
      </nav>

      {message && (
        <p role="status" aria-live="polite" className="feedback-banner">
          {message}
        </p>
      )}

      <div className="tab-content">
        {currentTab === "clubs" && (
        <ClubList
          clubs={clubs}
          onJoin={handleJoinClub}
          onLeave={handleLeaveClub}
          onCreateClub={handleCreateClub}
          onDeleteClub={handleDeleteClub}
          isAdmin={Boolean(user.isAdmin)}
        />
      )}

        {currentTab === "events" && (
          <>
            <EventForm onSubmit={handleCreateOrUpdateEvent} selectedEvent={selectedEvent} clubs={clubs} />
            <EventList
              events={events}
              onDelete={handleDelete}
              onEdit={handleEdit}
              currentUserId={user.id}
              onRsvp={handleRsvp}
              onCancelRsvp={handleCancelRsvp}
              registeredEventIds={registeredEventIds}
              rsvpStatusById={rsvpStatusById}
              isAdmin={Boolean(user.isAdmin)}
            />
          </>
        )}

        {currentTab === "your-events" && (
          <YourEventsList
            events={myEvents}
            currentUserId={user.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCancelRsvp={handleCancelRsvp}
          />
        )}

        {currentTab === "users" && user.isAdmin && (
          <>
            <UserForm onSubmit={handleCreateOrUpdateUser} selectedUser={selectedUser} onCancel={() => setSelectedUser(null)} />
            <UsersList
              users={users}
              onEditUser={setSelectedUser}
            />
          </>
        )}

        {currentTab === "account" && (
          <AccountInfo user={user} onPasswordChange={handlePasswordChange} authMessage={authMessage} authMessageType={authMessageType} />
        )}
      </div>
    </div>
  );
}
