import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
  IconButton,
  TextField,
  Chip
} from "@mui/material";
import {
  PeopleAlt,
  CheckCircle,
  Category,
  Delete,
  Visibility,
  Refresh,
  Search,
  PersonAdd
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const AdminDashboardComp = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
   const [skillApproval, setSkillApproval] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allUsersRes, activeRes, registerRes, skillRes,skillApprove] = await Promise.all([
        axios.get("/admin/all-user", { withCredentials: true }),
        axios.get("/admin/active-users", { withCredentials: true }),
        axios.get("/admin/register-users", { withCredentials: true }),
        axios.get("/admin/active-skill", { withCredentials: true }),
        axios.get('/admin/skill-requests',{withCredentials:true})
      ]);

      setUsers(allUsersRes.data?.data || []);
      setActiveUsers(activeRes.data?.data || []);
      setRegisteredUsers(registerRes.data?.data || []);
      setActiveSkills(skillRes.data?.data || []);
      setSkillApproval(skillApprove.data?.data || [])
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/delete-user/${userId}`, {
        withCredentials: true,
      });
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const viewSkills = (userId) => {
    navigate(`/admin/user-skill/${userId}`);
  };

  const getFilteredUsers = () => {
    let filtered = users;

    if (filter === "active") {
      const activeIds = activeUsers.map((u) => u._id);
      filtered = filtered.filter((u) => activeIds.includes(u._id));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.role?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getStatusInfo = (user) => {
    if (user.isActive) {
      return {
        text: "Active",
        color: "#4ade80",
        time: `Last active ${formatDistanceToNow(new Date(user.lastActiveAt))} ago`
      };
    }
    return {
      text: "Inactive",
      color: "#9ca3af",
      time: "Not recently active"
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = getFilteredUsers();

  return (
    <Box sx={{ maxWidth: "1280px", mx: "auto", p: 3, fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          borderRadius: "16px",
          color: "white",
          py: 6,
          px: 4,
          mb: 4,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 70%)",
          }
        }}
      >
        <Typography variant="h3" fontWeight={700} mb={2}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto", mb: 3 }}>
          Manage users, track platform growth, and oversee skill sharing activities
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "white",
              color: "#4f46e5",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              "&:hover": { bgcolor: "#e0e7ff" }
            }}
            startIcon={<Refresh />}
            onClick={fetchData}
            disabled={loading}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid >
          <Paper elevation={0} sx={{
            p: 3,
            borderRadius: "16px",
            bgcolor: "#f0f9ff",
            border: "1px solid #e0f2fe",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              transform: "translateY(-5px)",
              transition: "transform 0.3s ease"
            }
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{
                bgcolor: "#dbeafe",
                p: 2,
                borderRadius: "12px"
              }}>
                <PeopleAlt sx={{ color: "#3b82f6", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h6" color="#64748b">Total Registered Users</Typography>
                <Typography variant="h3" fontWeight={700} color="#1e40af">
                  {loading ? <CircularProgress size={28} /> : registeredUsers.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 3,
            borderRadius: "16px",
            bgcolor: "#f0fdf4",
            border: "1px solid #dcfce7",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              transform: "translateY(-5px)",
              transition: "transform 0.3s ease"
            }
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{
                bgcolor: "#dcfce7",
                p: 2,
                borderRadius: "12px"
              }}>
                <CheckCircle sx={{ color: "#22c55e", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h6" color="#64748b">Active Users</Typography>
                <Typography variant="h3" fontWeight={700} color="#166534">
                  {loading ? <CircularProgress size={28} /> : activeUsers.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 3,
            borderRadius: "16px",
            bgcolor: "#f5f3ff",
            border: "1px solid #ede9fe",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              transform: "translateY(-5px)",
              transition: "transform 0.3s ease"
            }
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{
                bgcolor: "#ede9fe",
                p: 2,
                borderRadius: "12px"
              }}>
                <Category sx={{ color: "#8b5cf6", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h6" color="#64748b">Active Skills</Typography>
                <Typography variant="h3" fontWeight={700} color="#5b21b6">
                  {loading ? <CircularProgress size={28} /> : activeSkills.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: "16px",
      bgcolor: "#eff6ff", // soft blue background
      border: "1px solid #dbeafe", // light blue border
      height: "100%",
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-5px)",
        transition: "transform 0.3s ease",
      },
    }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        sx={{
          bgcolor: "#dbeafe", // icon background
          p: 2,
          borderRadius: "12px",
        }}
      >
        <Category sx={{ color: "#3b82f6", fontSize: 32 }} /> {/* bright blue icon */}
      </Box>
      <Box>
        <Typography variant="h6" color="#1e3a8a">
          Skill Request
        </Typography>
        <Typography variant="h3" fontWeight={700} color="#1d4ed8">
          {loading ? <CircularProgress size={28} /> : skillApproval.length}
        </Typography>
      </Box>
    </Box>
  </Paper>
</Grid>

      </Grid>

      {/* User Management Section */}
      <Paper elevation={0} sx={{
        borderRadius: "16px",
        mb: 4,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        bgcolor: "white"
      }}>
        <Box
          bgcolor="#4f46e5"
          color="white"
          p={3}
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
        >
          <Typography variant="h5" fontWeight={600}>User Management</Typography>
          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "& input": { color: "white", py: 1, px: 2 },
                }
              }}
              InputProps={{
                startAdornment: <Search sx={{ color: "rgba(255,255,255,0.7)", mr: 1 }} />,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: "white" }}>Filter</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filter"
                sx={{
                  color: "white",
                  "& .MuiSelect-icon": { color: "white" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                }}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="active">Active Users</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress size={50} sx={{ color: "#4f46e5" }} />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="#64748b">
                No users found
              </Typography>
              <Typography variant="body2" color="#94a3b8" mt={1}>
                Try changing your search or filter criteria
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredUsers.map((user) => {
                const status = getStatusInfo(user);
                return (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <Card elevation={0} sx={{
                      borderRadius: "16px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      border: "1px solid #e2e8f0",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar
                            src={user.profileImage || "/placeholder.png"}
                            alt={user.fullName}
                            sx={{
                              width: 56,
                              height: 56,
                              border: `2px solid ${status.color}`
                            }}
                          />
                          <Box flex={1}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography fontWeight={700} fontSize="1.1rem">
                                {user.fullName || "Unnamed User"}
                              </Typography>
                              <Chip
                                label={status.text}
                                size="small"
                                sx={{
                                  bgcolor: `${status.color}20`,
                                  color: status.color,
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="#64748b">
                              {user.email}
                            </Typography>
                            <Typography variant="caption" color="#94a3b8" display="block" mt={0.5}>
                              {status.time}
                            </Typography>
                            <Box mt={1.5}>
                              <Chip
                                label={`Role: ${user.role}`}
                                size="small"
                                sx={{
                                  bgcolor: "#e0f2fe",
                                  color: "#0c4a6e",
                                  fontWeight: 500
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        <Box mt={2} display="flex" gap={1}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Visibility />}
                            onClick={() => viewSkills(user._id)}
                            size="small"
                            sx={{
                              bgcolor: "#4f46e5",
                              borderRadius: "50px",
                              fontWeight: 600,
                              "&:hover": { bgcolor: "#4338ca" }
                            }}
                          >
                            View Skills
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => deleteUser(user._id)}
                            size="small"
                            sx={{
                              borderRadius: "50px",
                              fontWeight: 600
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboardComp;
