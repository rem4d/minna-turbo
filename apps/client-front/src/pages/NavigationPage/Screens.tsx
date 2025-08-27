// @ts-nocheck
import React from "react";
import "./Screens.css";

// Home Screen Component
export const HomeScreen = ({ navigation }) => {
  const menuItems = [
    {
      title: "Profile",
      subtitle: "View and edit your profile",
      screen: "Profile",
    },
    {
      title: "Settings",
      subtitle: "App preferences and configuration",
      screen: "Settings",
    },
    { title: "Messages", subtitle: "Your conversations", screen: "Messages" },
    { title: "Photos", subtitle: "Your photo library", screen: "Photos" },
    { title: "Music", subtitle: "Your music collection", screen: "Music" },
    { title: "Notes", subtitle: "Your notes and reminders", screen: "Notes" },
  ];

  const handleItemPress = (item) => {
    const screenComponents = {
      Profile: ProfileScreen,
      Settings: SettingsScreen,
      Messages: MessagesScreen,
      Photos: PhotosScreen,
      Music: MusicScreen,
      Notes: NotesScreen,
    };

    navigation.push(screenComponents[item.screen], item.title);
  };

  return (
    <div className="home-screen">
      <div className="welcome-section">
        <h2>Welcome Back!</h2>
        <p>Choose an option below to get started</p>
      </div>

      <div className="menu-list">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => handleItemPress(item)}
          >
            <div className="menu-item-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
            <div className="menu-item-arrow">
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
                <path
                  d="M1 1L6.5 6.5L1 12"
                  stroke="#C7C7CC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Profile Screen Component
export const ProfileScreen = ({ navigation }) => {
  const profileData = [
    { label: "Name", value: "John Doe" },
    { label: "Email", value: "john.doe@example.com" },
    { label: "Phone", value: "+1 (555) 123-4567" },
    { label: "Location", value: "San Francisco, CA" },
  ];

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <div className="avatar">
          <img
            src="https://via.placeholder.com/100x100/007AFF/FFFFFF?text=JD"
            alt="Profile"
          />
        </div>
        <h2>Profile Information</h2>
      </div>

      <div className="profile-details">
        {profileData.map((item, index) => (
          <div key={index} className="detail-item">
            <span className="detail-label">{item.label}</span>
            <span className="detail-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="button-section">
        <button
          className="edit-button"
          onClick={() => navigation.push(EditProfileScreen, "Edit Profile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

// Edit Profile Screen
export const EditProfileScreen = ({ navigation }) => {
  return (
    <div className="edit-profile-screen">
      <div className="form-container">
        <div className="input-group">
          <label>First Name</label>
          <input type="text" defaultValue="John" />
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input type="text" defaultValue="Doe" />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" defaultValue="john.doe@example.com" />
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input type="tel" defaultValue="+1 (555) 123-4567" />
        </div>

        <button className="save-button">Save Changes</button>
      </div>
    </div>
  );
};

// Settings Screen Component
export const SettingsScreen = ({ navigation }) => {
  const settingsItems = [
    { title: "Notifications", hasArrow: true },
    { title: "Privacy", hasArrow: true },
    { title: "Account", hasArrow: true },
    { title: "Dark Mode", hasToggle: true, enabled: false },
    { title: "Face ID", hasToggle: true, enabled: true },
    { title: "Location Services", hasToggle: true, enabled: true },
  ];

  return (
    <div className="settings-screen">
      <div className="settings-list">
        {settingsItems.map((item, index) => (
          <div key={index} className="settings-item">
            <span className="settings-title">{item.title}</span>
            {item.hasArrow && (
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
                <path
                  d="M1 1L6.5 6.5L1 12"
                  stroke="#C7C7CC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {item.hasToggle && (
              <div className={`toggle ${item.enabled ? "enabled" : ""}`}>
                <div className="toggle-thumb"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Messages Screen Component
export const MessagesScreen = ({ navigation }) => {
  const messages = [
    {
      name: "Alice Johnson",
      preview: "Hey! Are we still on for lunch?",
      time: "10:30 AM",
      unread: true,
    },
    {
      name: "Bob Smith",
      preview: "Thanks for the help yesterday",
      time: "9:15 AM",
      unread: false,
    },
    {
      name: "Carol Davis",
      preview: "Can you send me the report?",
      time: "Yesterday",
      unread: true,
    },
    {
      name: "David Wilson",
      preview: "Great job on the presentation!",
      time: "Yesterday",
      unread: false,
    },
    {
      name: "Emma Brown",
      preview: "See you at the meeting",
      time: "Tuesday",
      unread: false,
    },
  ];

  return (
    <div className="messages-screen">
      <div className="messages-list">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-item ${message.unread ? "unread" : ""}`}
          >
            <div className="message-avatar">
              <img
                src={`https://via.placeholder.com/40x40/007AFF/FFFFFF?text=${message.name.charAt(0)}`}
                alt={message.name}
              />
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-name">{message.name}</span>
                <span className="message-time">{message.time}</span>
              </div>
              <p className="message-preview">{message.preview}</p>
            </div>
            {message.unread && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Photos Screen Component
export const PhotosScreen = ({ navigation }) => {
  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    url: `https://via.placeholder.com/150x150/007AFF/FFFFFF?text=Photo${i + 1}`,
  }));

  return (
    <div className="photos-screen">
      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <img src={photo.url} alt={`Photo ${photo.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Music Screen Component
export const MusicScreen = ({ navigation }) => {
  const songs = [
    {
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
    },
    { title: "Hotel California", artist: "Eagles", album: "Hotel California" },
    {
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
    },
    {
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
    },
    { title: "Billie Jean", artist: "Michael Jackson", album: "Thriller" },
  ];

  return (
    <div className="music-screen">
      <div className="music-list">
        {songs.map((song, index) => (
          <div key={index} className="song-item">
            <div className="song-artwork">
              <img
                src={`https://via.placeholder.com/50x50/007AFF/FFFFFF?text=${index + 1}`}
                alt="Album artwork"
              />
            </div>
            <div className="song-info">
              <h4>{song.title}</h4>
              <p>
                {song.artist} • {song.album}
              </p>
            </div>
            <button className="play-button">▶</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Notes Screen Component
export const NotesScreen = ({ navigation }) => {
  const notes = [
    {
      title: "Shopping List",
      preview: "Milk, Bread, Eggs, Butter...",
      date: "Today",
    },
    {
      title: "Meeting Notes",
      preview: "Discussed project timeline and...",
      date: "Yesterday",
    },
    {
      title: "Book Ideas",
      preview: "Chapter 1: The beginning of...",
      date: "2 days ago",
    },
    {
      title: "Travel Plans",
      preview: "Flight: 9:30 AM, Hotel...",
      date: "Last week",
    },
  ];

  return (
    <div className="notes-screen">
      <div className="notes-list">
        {notes.map((note, index) => (
          <div key={index} className="note-item">
            <div className="note-content">
              <h3>{note.title}</h3>
              <p>{note.preview}</p>
              <span className="note-date">{note.date}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="add-note-button">
        <span>+</span>
        Add Note
      </button>
    </div>
  );
};
