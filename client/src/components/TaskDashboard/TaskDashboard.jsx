import React, { useEffect, useState } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTooltip,
} from "mdb-react-ui-kit";
import styles from "./TaskDashboard.module.css";
import { API_BASE_URL } from "../../config";
import ReactPaginate from "react-paginate";

export default function Register() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [formTask, setFormTask] = useState({
    title: "",
    description: "",
    priority: " ",
  });
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;

  const isLoggedIn = localStorage.getItem("token") ? true : false;

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Network response was not ok.");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const updateTaskStatus = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompletedTask: true }),
      });
      if (!response.ok) throw new Error("Failed to update task.");
      fetchTasks(); // Refresh the tasks list to reflect changes
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete task.");
      fetchTasks(); // Refresh the tasks list to reflect changes
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "${API_BASE_URL}/tasks/${taskId}",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formTask, isCompletedTask: false }),
        }
      );
      if (!response.ok) throw new Error("Failed to create task.");
      setShowForm(false); // Hide form after task creation
      setFormTask({
        title: "",
        description: "",
        priority: "Medium",
      });
      fetchTasks(); // Refresh the tasks list to reflect the new task
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const renderTasksTable = (tasksArray, status) => (
    <MDBTable className="text-black mb-0">
      <MDBTableHead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Name of Employee</th>
          <th scope="col">Employee priority</th>
          <th scope="col">Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {tasksArray.map((task) => (
          <tr className="fw-normal" key={task._id}>
            <td className="align-middle">
              {task.isCompletedTask ? "Completed" : "In Progress"}
            </td>
            <td className="align-middle">
              <span style={{ fontWeight: "bold" }}>{task.title}</span>
              <br />
              <span style={{ fontSize: "small", color: "gray" }}>
                {task.description}
              </span>
            </td>
            <td className="align-middle">
              <h6 className="mb-0">
                <MDBBadge
                  className="mx-2"
                  color={
                    task.priority === "High"
                      ? "danger"
                      : task.priority === "Low"
                      ? "success"
                      : "warning"
                  }
                >
                  {task.priority} priority
                </MDBBadge>
              </h6>
            </td>
            <td className="align-middle">
              {!task.isCompletedTask && (
                <MDBTooltip tag="a" wrapperProps={{ href: "#!" }} title="Done">
                  <MDBIcon
                    fas
                    icon="check"
                    color="success"
                    size="lg"
                    className="me-3"
                    onClick={() => updateTaskStatus(task._id)}
                  />
                </MDBTooltip>
              )}
              <MDBTooltip tag="a" wrapperProps={{ href: "#!" }} title="Remove">
                <MDBIcon
                  fas
                  icon="trash-alt"
                  color="warning"
                  size="lg"
                  className="me-3"
                  onClick={() => deleteTask(task._id)}
                />
              </MDBTooltip>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );

  const pageCount = Math.ceil(users.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayUsers = users
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((user) => (
      <tr key={user.id}>
        <td className="align-middle">{user.name}</td>
        <td className="align-middle">{user.username}</td>
        <td className="align-middle">{user.email}</td>
        <td className="align-middle">{user.company.name}</td>
      </tr>
    ));

  return (
    <section className={styles.gradient}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol md="12" xl="10">
            <MDBCard>
              {isLoggedIn && (
                <MDBBtn
                  style={{ position: "absolute", right: "10px", top: "10px" }}
                  color="danger"
                  onClick={() => {
                    localStorage.removeItem("token"); // Clear token from localStorage
                    window.location.reload(); // Reload the page
                  }}
                >
                  Logout
                </MDBBtn>
              )}
              <MDBCardBody className="p-4 text-black">
                <div className="text-center pt-3 pb-2">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-todo-list/check1.webp"
                    alt="Check"
                    width="60"
                  />
                  <h2 className="my-4">Employee List</h2>

                  {isLoggedIn && (
                    <MDBBtn onClick={() => setShowForm(!showForm)}>
                      Add Employee
                    </MDBBtn>
                  )}
                </div>
                {showForm && (
                  <form onSubmit={handleCreateTask}>
                    <MDBInput
                      className="my-4 mx-4"
                      label="Employee ID"
                      type="text"
                      name="title"
                      value={formTask.title}
                      onChange={handleFormChange}
                      required
                    />
                    <MDBInput
                      label="Employee Name"
                      className="my-4 mx-4"
                      type="text"
                      name="description"
                      value={formTask.description}
                      onChange={handleFormChange}
                      required
                    />
                    <select
                      className="browser-default custom-select mx-4 my-4 "
                      name="priority"
                      value={formTask.priority}
                      onChange={handleFormChange}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <MDBBtn type="submit" className="my-4 mx-4">
                      Save Employee
                    </MDBBtn>
                    <MDBBtn
                      color="danger"
                      className="my-4 mx-4"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </MDBBtn>
                  </form>
                )}
                {!isLoggedIn && (
                  <div>
                    <h2>Welcome to the Employee Management App</h2>
                    <p>
                      Manage your Employee details effiecently in Employee App
                    </p>
                    <div>
                      <a href="/login" className="btn btn-primary mx-2">
                        Login
                      </a>
                      <a href="/register" className="btn btn-secondary mx-2">
                        Sign Up
                      </a>
                    </div>
                  </div>
                )}

                {isLoggedIn && (
                  <div>
                    <h3>Listed Employees</h3>
                    <MDBTable className="text-black mb-0">
                      <MDBTableHead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Username</th>
                          <th scope="col">Email</th>
                          <th scope="col">Company</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>{displayUsers}</MDBTableBody>
                    </MDBTable>
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      pageCount={pageCount}
                      onPageChange={changePage}
                      containerClassName={"pagination"}
                      previousLinkClassName={"pagination__link"}
                      nextLinkClassName={"pagination__link"}
                      disabledClassName={"pagination__link--disabled"}
                      activeClassName={"pagination__link--active"}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                        marginBottom: "20px", // Add margin bottom for spacing
                      }}
                    />
                  </div>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
