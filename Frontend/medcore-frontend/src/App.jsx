import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";

const API = "http://localhost:7777/api";

const emptyPatient = {
  patientName: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  bloodGroup: "",
  address: "",
};

const emptyDoctor = {
  doctorName: "",
  specialization: "",
  qualification: "",
  experience: "",
  phone: "",
  email: "",
  consultationFee: "",
};

const emptyAppointment = {
  patientId: "",
  doctorId: "",
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
  status: "Pending",
};

function App() {
  const [page, setPage] = useState("Dashboard");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [appointmentForm, setAppointmentForm] =
    useState(emptyAppointment);

  const [editingId, setEditingId] = useState(null);
  const [doctorEditingId, setDoctorEditingId] = useState(null);
  const [appointmentEditingId, setAppointmentEditingId] =
    useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] =
    useState(false);

  const [search, setSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [hospitalName, setHospitalName] =
    useState("MEDCORE Hospital");
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState(
    localStorage.getItem("medcoreEmail") || "admin@medcore.com"
  );

  // Restore login after refreshing the browser.
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("medcoreToken"))
  );

  // LOCAL DATE FOR APPOINTMENT VALIDATION

  const currentDate = new Date();

  const minAppointmentDate =
    `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(
      currentDate.getDate()
    ).padStart(2, "0")}`;

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated]);

  // SEND JWT TOKEN WITH EVERY PROTECTED API REQUEST

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("medcoreToken");

    if (!token) {
      localStorage.removeItem("medcoreEmail");
      setIsAuthenticated(false);
      throw new Error("Your session has expired. Please login again.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("medcoreToken");
      localStorage.removeItem("medcoreEmail");
      setIsAuthenticated(false);
      throw new Error("Your session has expired. Please login again.");
    }

    return response;
  };

  // LOAD DASHBOARD DATA

  const loadDashboard = async () => {
    try {
      const [patientRes, doctorRes, appointmentRes] =
        await Promise.all([
          authFetch(`${API}/patients`),
          authFetch(`${API}/doctors`),
          authFetch(`${API}/appointments`),
        ]);

      if (
        !patientRes.ok ||
        !doctorRes.ok ||
        !appointmentRes.ok
      ) {
        throw new Error(
          "Unable to load hospital information."
        );
      }

      const patientData = await patientRes.json();
      const doctorData = await doctorRes.json();
      const appointmentData = await appointmentRes.json();

      setPatients(patientData);
      setDoctors(doctorData);
      setAppointments(appointmentData);

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // PATIENT MANAGEMENT

  const openAddForm = () => {
    setPatientForm(emptyPatient);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const handleChange = (e) => {
    setPatientForm({
      ...patientForm,
      [e.target.name]: e.target.value,
    });
  };

  const savePatient = async (e) => {
    e.preventDefault();

    const patientData = {
      ...patientForm,
      age: Number(patientForm.age),
    };

    try {
      const url = editingId
        ? `${API}/patients/${editingId}`
        : `${API}/patients`;

      const response = await authFetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error(
          "Unable to save patient. Please check the details."
        );
      }

      const wasEditing = editingId !== null;

      await loadDashboard();

      setShowForm(false);
      setPatientForm(emptyPatient);
      setEditingId(null);

      setMessage(
        wasEditing
          ? "Patient updated successfully!"
          : "Patient added successfully!"
      );

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const editPatient = (patient) => {
    setPatientForm({
      patientName: patient.patientName || "",
      age: patient.age ?? "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      email: patient.email || "",
      bloodGroup: patient.bloodGroup || "",
      address: patient.address || "",
    });

    setEditingId(patient.id);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const deletePatient = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this patient?"
      )
    ) {
      return;
    }

    try {
      const response = await authFetch(
        `${API}/patients/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete patient.");
      }

      await loadDashboard();

      setMessage("Patient deleted successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // DOCTOR MANAGEMENT

  const openAddDoctorForm = () => {
    setDoctorForm(emptyDoctor);
    setDoctorEditingId(null);
    setShowDoctorForm(true);
    setMessage("");
    setError("");
  };

  const handleDoctorChange = (e) => {
    setDoctorForm({
      ...doctorForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveDoctor = async (e) => {
    e.preventDefault();

    const doctorData = {
      ...doctorForm,
      experience: Number(doctorForm.experience),
      consultationFee: Number(doctorForm.consultationFee),
    };

    try {
      const url = doctorEditingId
        ? `${API}/doctors/${doctorEditingId}`
        : `${API}/doctors`;

      const response = await authFetch(url, {
        method: doctorEditingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        throw new Error(
          "Unable to save doctor. Please check the details."
        );
      }

      const wasEditing = doctorEditingId !== null;

      await loadDashboard();

      setShowDoctorForm(false);
      setDoctorForm(emptyDoctor);
      setDoctorEditingId(null);

      setMessage(
        wasEditing
          ? "Doctor updated successfully!"
          : "Doctor added successfully!"
      );

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const editDoctor = (doctor) => {
    setDoctorForm({
      doctorName: doctor.doctorName || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience ?? "",
      phone: doctor.phone || "",
      email: doctor.email || "",
      consultationFee: doctor.consultationFee ?? "",
    });

    setDoctorEditingId(doctor.id);
    setShowDoctorForm(true);
    setMessage("");
    setError("");
  };

  const deleteDoctor = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this doctor?"
      )
    ) {
      return;
    }

    try {
      const response = await authFetch(
        `${API}/doctors/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete doctor.");
      }

      await loadDashboard();

      setMessage("Doctor deleted successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // APPOINTMENT MANAGEMENT

  const openAddAppointmentForm = () => {
    setAppointmentForm(emptyAppointment);
    setAppointmentEditingId(null);
    setShowAppointmentForm(true);
    setMessage("");
    setError("");
  };

  const handleAppointmentChange = (e) => {
    setAppointmentForm({
      ...appointmentForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      ...appointmentForm,
      patientId: Number(appointmentForm.patientId),
      doctorId: Number(appointmentForm.doctorId),
    };

    try {
      const url = appointmentEditingId
        ? `${API}/appointments/${appointmentEditingId}`
        : `${API}/appointments`;

      const response = await authFetch(url, {
        method: appointmentEditingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(
          "Unable to save appointment. Please check the details."
        );
      }

      const wasEditing = appointmentEditingId !== null;

      await loadDashboard();

      setShowAppointmentForm(false);
      setAppointmentForm(emptyAppointment);
      setAppointmentEditingId(null);

      setMessage(
        wasEditing
          ? "Appointment updated successfully!"
          : "Appointment booked successfully!"
      );

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const editAppointment = (appointment) => {
    setAppointmentForm({
      patientId: appointment.patientId ?? "",
      doctorId: appointment.doctorId ?? "",
      appointmentDate: appointment.appointmentDate || "",
      appointmentTime: appointment.appointmentTime || "",
      reason: appointment.reason || "",
      status: appointment.status || "Pending",
    });

    setAppointmentEditingId(appointment.id);
    setShowAppointmentForm(true);
    setMessage("");
    setError("");
  };

  const deleteAppointment = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this appointment?"
      )
    ) {
      return;
    }

    try {
      const response = await authFetch(
        `${API}/appointments/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete appointment.");
      }

      await loadDashboard();

      setMessage("Appointment deleted successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // SEARCH AND FILTER

  const filteredPatients = patients.filter((patient) =>
    (patient.patientName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.doctorName || ""} ${doctor.specialization || ""}`
      .toLowerCase()
      .includes(doctorSearch.toLowerCase())
  );

  const filteredAppointments = appointments.filter(
    (appointment) => {
      if (statusFilter === "All") {
        return true;
      }

      return (
        (appointment.status || "").toLowerCase() ===
        statusFilter.toLowerCase()
      );
    }
  );

  const pendingAppointments = appointments.filter(
    (appointment) =>
      (appointment.status || "").toLowerCase() === "pending"
  ).length;

  // NAVIGATION

  const navigate = (selectedPage) => {
    setPage(selectedPage);

    setShowForm(false);
    setShowDoctorForm(false);
    setShowAppointmentForm(false);

    setMessage("");
    setError("");
  };

  // SETTINGS

  const saveSettings = (e) => {
    e.preventDefault();

    setMessage("Settings saved successfully!");
    setError("");
  };

  // LOGIN SUCCESS

  const handleLogin = (email) => {
    localStorage.setItem("medcoreEmail", email);
    setAdminEmail(email);
    setAdminName("Administrator");
    setIsAuthenticated(true);
    setPage("Dashboard");
    setMessage("Welcome to MEDCORE!");
    setError("");
  };

  // LOGOUT

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout from MEDCORE?"
    );

    if (confirmLogout) {
      localStorage.removeItem("medcoreToken");
      localStorage.removeItem("medcoreEmail");
      setIsAuthenticated(false);
      setMessage("");
      setError("");
      setPage("Dashboard");
    }
  };

  // SHOW LOGIN BEFORE DASHBOARD

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <h2>✚ MEDCORE</h2>

        <p className="menu-title">MAIN MENU</p>

        <div
          className={`menu-item ${
            page === "Dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("Dashboard")}
        >
          ▦ Dashboard
        </div>

        <div
          className={`menu-item ${
            page === "Patients" ? "active" : ""
          }`}
          onClick={() => navigate("Patients")}
        >
          ♙ Patients
        </div>

        <div
          className={`menu-item ${
            page === "Doctors" ? "active" : ""
          }`}
          onClick={() => navigate("Doctors")}
        >
          ⚕ Doctors
        </div>

        <div
          className={`menu-item ${
            page === "Appointments" ? "active" : ""
          }`}
          onClick={() => navigate("Appointments")}
        >
          ▣ Appointments
        </div>

        <div className="sidebar-bottom">
          <div
            className={`menu-item ${
              page === "Settings" ? "active" : ""
            }`}
            onClick={() => navigate("Settings")}
          >
            ⚙ Settings
          </div>

          <div className="menu-item" onClick={handleLogout}>
            ↪ Logout
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{page}</h1>
            <p>{hospitalName} Management System</p>
          </div>

          <div className="admin-profile">
            <span>👨‍⚕️</span>

            <div>
              <strong>{adminName}</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        {error && <p className="error-message">{error}</p>}

        {message && (
          <p className="success-message">{message}</p>
        )}

        {/* DASHBOARD */}

        {page === "Dashboard" && (
          <>
            <section className="welcome-card">
              <div>
                <h2>Welcome to MEDCORE</h2>

                <p>
                  Manage your hospital operations in one place.
                </p>
              </div>

              <span className="welcome-icon">🏥</span>
            </section>

            {/* STATISTICS */}

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon blue">♙</span>
                <p>Total Patients</p>
                <h2>{patients.length}</h2>
                <small>Registered patients</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon green">⚕</span>
                <p>Total Doctors</p>
                <h2>{doctors.length}</h2>
                <small>Available doctors</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon purple">▣</span>
                <p>Appointments</p>
                <h2>{appointments.length}</h2>
                <small>Total appointments</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon orange">◷</span>
                <p>Pending</p>
                <h2>{pendingAppointments}</h2>
                <small>Awaiting confirmation</small>
              </div>
            </section>

            {/* RECENT APPOINTMENTS */}

            <section className="content-card">
              <div className="patient-header">
                <div>
                  <h2>Recent Appointments</h2>
                  <p>Latest 5 hospital appointments.</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => navigate("Appointments")}
                >
                  View All
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments
                      .slice(-5)
                      .reverse()
                      .map((appointment) => {
                        const patient = patients.find(
                          (item) =>
                            Number(item.id) ===
                            Number(appointment.patientId)
                        );

                        const doctor = doctors.find(
                          (item) =>
                            Number(item.id) ===
                            Number(appointment.doctorId)
                        );

                        return (
                          <tr key={appointment.id}>
                            <td>
                              {patient
                                ? patient.patientName
                                : `Patient #${appointment.patientId}`}
                            </td>

                            <td>
                              {doctor
                                ? doctor.doctorName
                                : `Doctor #${appointment.doctorId}`}
                            </td>

                            <td>
                              {appointment.appointmentDate}
                            </td>

                            <td>
                              {appointment.appointmentTime}
                            </td>

                            <td>
                              <span
                                className={`status-badge ${(appointment.status || "").toLowerCase()}`}
                              >
                               {appointment.status
                         ? appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1).toLowerCase()
                          : "Pending"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="5">
                          No appointments available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* HOSPITAL MANAGEMENT */}

            <section className="content-card">
              <h2>Hospital Management</h2>

              <p>
                Manage patients, doctors and appointments easily
                from your MEDCORE dashboard.
              </p>

              <div className="quick-actions">
                <button onClick={() => navigate("Patients")}>
                  View Patients
                </button>

                <button onClick={() => navigate("Doctors")}>
                  View Doctors
                </button>

                <button
                  onClick={() => navigate("Appointments")}
                >
                  View Appointments
                </button>
              </div>
            </section>
          </>
        )}

        {/* PATIENT MANAGEMENT */}

        {page === "Patients" && (
          <section className="content-card patient-section">
            <div className="patient-header">
              <div>
                <h2>Patient Management</h2>
                <p>Manage all registered hospital patients.</p>
              </div>

              <button
                className="primary-button"
                onClick={openAddForm}
              >
                + Add Patient
              </button>
            </div>

            <input
              className="search-input"
              type="text"
              placeholder="Search patient by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {showForm && (
              <form
                className="patient-form"
                onSubmit={savePatient}
              >
                <h3>
                  {editingId
                    ? "Edit Patient Details"
                    : "Add New Patient"}
                </h3>

                <div className="form-grid">
                  <input
                    name="patientName"
                    placeholder="Patient Name"
                    value={patientForm.patientName}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={patientForm.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    required
                  />

                  <select
                    name="gender"
                    value={patientForm.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={patientForm.phone}
                    onChange={handleChange}
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                    title="Enter a valid 10-digit Indian mobile number"
                    required
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={patientForm.email}
                    onChange={handleChange}
                  />

                  <select
                    name="bloodGroup"
                    value={patientForm.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Blood Group</option>

                    {[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                    ].map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>

                  <textarea
                    name="address"
                    placeholder="Patient Address"
                    value={patientForm.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {editingId
                      ? "Update Patient"
                      : "Save Patient"}
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Blood Group</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>{patient.patientName}</td>
                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.bloodGroup}</td>

                      <td>
                        <button
                          className="edit-button"
                          onClick={() => editPatient(patient)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deletePatient(patient.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan="7">No patients found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* DOCTOR MANAGEMENT */}

        {page === "Doctors" && (
          <section className="content-card patient-section">
            <div className="patient-header">
              <div>
                <h2>Doctor Management</h2>
                <p>Manage all hospital doctors and their details.</p>
              </div>

              <button
                className="primary-button"
                onClick={openAddDoctorForm}
              >
                + Add Doctor
              </button>
            </div>

            <input
              className="search-input"
              type="text"
              placeholder="Search doctor by name or specialization..."
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
            />

            {showDoctorForm && (
              <form
                className="patient-form"
                onSubmit={saveDoctor}
              >
                <h3>
                  {doctorEditingId
                    ? "Edit Doctor Details"
                    : "Add New Doctor"}
                </h3>

                <div className="form-grid">
                  <input
                    name="doctorName"
                    placeholder="Doctor Name"
                    value={doctorForm.doctorName}
                    onChange={handleDoctorChange}
                    required
                  />

                  <input
                    name="specialization"
                    placeholder="Specialization"
                    value={doctorForm.specialization}
                    onChange={handleDoctorChange}
                    required
                  />

                  <input
                    name="qualification"
                    placeholder="Qualification"
                    value={doctorForm.qualification}
                    onChange={handleDoctorChange}
                    required
                  />

                  <input
                    name="experience"
                    type="number"
                    min="0"
                    placeholder="Experience in Years"
                    value={doctorForm.experience}
                    onChange={handleDoctorChange}
                    required
                  />

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={doctorForm.phone}
                    onChange={handleDoctorChange}
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                    title="Enter a valid 10-digit Indian mobile number"
                    required
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={doctorForm.email}
                    onChange={handleDoctorChange}
                  />

                  <input
                    name="consultationFee"
                    type="number"
                    min="0"
                    placeholder="Consultation Fee"
                    value={doctorForm.consultationFee}
                    onChange={handleDoctorChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {doctorEditingId
                      ? "Update Doctor"
                      : "Save Doctor"}
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowDoctorForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Consultation Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.id}</td>
                      <td>{doctor.doctorName}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.qualification}</td>
                      <td>{doctor.experience} years</td>
                      <td>{doctor.phone}</td>
                      <td>{doctor.email || "N/A"}</td>
                      <td>₹{doctor.consultationFee}</td>

                      <td>
                        <button
                          className="edit-button"
                          onClick={() => editDoctor(doctor)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteDoctor(doctor.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredDoctors.length === 0 && (
                    <tr>
                      <td colSpan="9">No doctors found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* APPOINTMENT MANAGEMENT */}

        {page === "Appointments" && (
          <section className="content-card patient-section">
            <div className="patient-header">
              <div>
                <h2>Appointment Management</h2>
                <p>Book and manage hospital appointments.</p>
              </div>

              <button
                className="primary-button"
                onClick={openAddAppointmentForm}
              >
                + Book Appointment
              </button>
            </div>

            <select
              className="search-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                maxWidth: "250px",
                marginBottom: "20px",
              }}
            >
              <option value="All">All Appointments</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {showAppointmentForm && (
              <form
                className="patient-form"
                onSubmit={saveAppointment}
              >
                <h3>
                  {appointmentEditingId
                    ? "Edit Appointment"
                    : "Book New Appointment"}
                </h3>

                <div className="form-grid">
                  <select
                    name="patientId"
                    value={appointmentForm.patientId}
                    onChange={handleAppointmentChange}
                    required
                  >
                    <option value="">Select Patient</option>

                    {patients.map((patient) => (
                      <option
                        key={patient.id}
                        value={patient.id}
                      >
                        {patient.patientName} (ID: {patient.id})
                      </option>
                    ))}
                  </select>

                  <select
                    name="doctorId"
                    value={appointmentForm.doctorId}
                    onChange={handleAppointmentChange}
                    required
                  >
                    <option value="">Select Doctor</option>

                    {doctors.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.doctorName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>

                  <input
                    name="appointmentDate"
                    type="date"
                    min={minAppointmentDate}
                    value={appointmentForm.appointmentDate}
                    onChange={handleAppointmentChange}
                    required
                  />

                  <input
                    name="appointmentTime"
                    type="time"
                    value={appointmentForm.appointmentTime}
                    onChange={handleAppointmentChange}
                    required
                  />

                  <input
                    name="reason"
                    type="text"
                    placeholder="Reason for Visit"
                    value={appointmentForm.reason}
                    onChange={handleAppointmentChange}
                    required
                  />

                  <select
                    name="status"
                    value={appointmentForm.status}
                    onChange={handleAppointmentChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="form-buttons">
                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {appointmentEditingId
                      ? "Update Appointment"
                      : "Save Appointment"}
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowAppointmentForm(false);
                      setAppointmentForm(emptyAppointment);
                      setAppointmentEditingId(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((appointment) => {
                    const patient = patients.find(
                      (item) =>
                        Number(item.id) ===
                        Number(appointment.patientId)
                    );

                    const doctor = doctors.find(
                      (item) =>
                        Number(item.id) ===
                        Number(appointment.doctorId)
                    );

                    return (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>

                        <td>
                          {patient
                            ? patient.patientName
                            : `Patient #${appointment.patientId}`}
                        </td>

                        <td>
                          {doctor
                            ? doctor.doctorName
                            : `Doctor #${appointment.doctorId}`}
                        </td>

                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.appointmentTime}</td>
                        <td>{appointment.reason}</td>

                        <td>
                          <span
                            className={`status-badge ${(appointment.status || "").toLowerCase()}`}
                          >
                            {appointment.status
                     ? appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1).toLowerCase()
                      : "Pending"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="edit-button"
                            onClick={() =>
                              editAppointment(appointment)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              deleteAppointment(appointment.id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan="8">
                        No appointments found for this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SETTINGS PAGE */}

        {page === "Settings" && (
          <section className="content-card patient-section">
            <div className="patient-header">
              <div>
                <h2>⚙ System Settings</h2>
                <p>
                  Manage your hospital and administrator information.
                </p>
              </div>
            </div>

            <form
              className="patient-form"
              onSubmit={saveSettings}
            >
              <h3>Hospital Information</h3>

              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Hospital Name"
                  value={hospitalName}
                  onChange={(e) =>
                    setHospitalName(e.target.value)
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Administrator Name"
                  value={adminName}
                  onChange={(e) =>
                    setAdminName(e.target.value)
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Administrator Email"
                  value={adminEmail}
                  onChange={(e) =>
                    setAdminEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-buttons">
                <button
                  type="submit"
                  className="primary-button"
                >
                  Save Settings
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate("Dashboard")}
                >
                  Back to Dashboard
                </button>
              </div>
            </form>

            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#f3f6fb",
                borderRadius: "10px",
              }}
            >
              <h3>System Information</h3>

              <p>
                <strong>Application:</strong> MEDCORE Hospital
                Management System
              </p>

              <p>
                <strong>Frontend:</strong> React.js
              </p>

              <p>
                <strong>Backend:</strong> Java Spring Boot
              </p>

              <p>
                <strong>Database:</strong> MySQL
              </p>

              <p>
                <strong>Version:</strong> 1.0.0
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;