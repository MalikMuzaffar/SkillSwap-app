import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Paper,
  Grid,
  IconButton,
  Chip,
  CircularProgress
} from "@mui/material";
import {
  Refresh,
  FilterAlt,
  InsertDriveFile,
  Image,
  PictureAsPdf,
  Description,
  Videocam,
  Audiotrack,
  Download,
  Clear
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

const RetrieveChatComp = () => {
  const { skillId } = useParams();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState({ type: "all", role: "all", date: "" });
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/admin/chat/${skillId}`, {
          withCredentials: true
        });
        setMessages(data.data);
        setFilteredMessages(data.data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [skillId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredMessages]);

  const handleFilterChange = (key, value) => {
    const newFilter = { ...filter, [key]: value };
    setFilter(newFilter);

    const filtered = messages.filter((msg) => {
      const fileMatch =
        newFilter.type === "all" ||
        (newFilter.type === "file" && msg.isFile) ||
        (newFilter.type === "text" && !msg.isFile);

      const roleMatch =
        newFilter.role === "all" ||
        (msg.RoomId?.members.find((m) => m.user === msg.senderId?._id)?.role === newFilter.role);

      const dateMatch =
        !newFilter.date ||
        new Date(msg.createdAt).toDateString() === new Date(newFilter.date).toDateString();

      return fileMatch && roleMatch && dateMatch;
    });
    setFilteredMessages(filtered);
  };

  const resetFilters = () => {
    setFilter({ type: "all", role: "all", date: "" });
    setFilteredMessages(messages);
  };

  const getFileType = (fileName) => {
    if (!fileName) return "unknown";
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    if (["doc", "docx"].includes(ext)) return "doc";
    if (["xls", "xlsx"].includes(ext)) return "sheet";
    if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "video";
    if (["mp3", "wav", "ogg"].includes(ext)) return "audio";
    return "file";
  };

  const renderFilePreview = (msg) => {
    if (!msg.isFile) return null;

    const fileType = getFileType(msg.fileName);
    const fileName = msg.fileName || "File";

    const fileIcons = {
      image: <Image sx={{ color: "#ef4444", fontSize: 40 }} />,
      pdf: <PictureAsPdf sx={{ color: "#ef4444", fontSize: 40 }} />,
      doc: <Description sx={{ color: "#2563eb", fontSize: 40 }} />,
      sheet: <Description sx={{ color: "#16a34a", fontSize: 40 }} />,
      video: <Videocam sx={{ color: "#9333ea", fontSize: 40 }} />,
      audio: <Audiotrack sx={{ color: "#ea580c", fontSize: 40 }} />,
      file: <InsertDriveFile sx={{ color: "#64748b", fontSize: 40 }} />
    };

    const fileColors = {
      image: "#fecaca",
      pdf: "#fecaca",
      doc: "#dbeafe",
      sheet: "#dcfce7",
      video: "#f3e8ff",
      audio: "#ffedd5",
      file: "#e2e8f0"
    };

    const fileTypeNames = {
      image: "Image",
      pdf: "PDF",
      doc: "Document",
      sheet: "Spreadsheet",
      video: "Video",
      audio: "Audio",
      file: "File"
    };

    return (
      <Box
        sx={{
          bgcolor: fileColors[fileType] || "#e2e8f0",
          p: 2,
          borderRadius: "12px",
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {fileIcons[fileType]}
        <Typography variant="body2" fontWeight={500} mt={1}>
          {fileName}
        </Typography>
        <Chip label={fileTypeNames[fileType]} size="small" sx={{ mt: 1, bgcolor: "white" }} />

        {fileType === "image" && (
          <img
            src={msg.fileUrl}
            alt="Uploaded file"
            className="w-full max-w-xs rounded border mt-3"
          />
        )}

        {fileType === "pdf" && (
          <iframe
            src={msg.fileUrl}
            title="PDF Preview"
            className="w-full h-64 border rounded mt-3"
          />
        )}

        {fileType === "video" && (
          <video controls className="w-full max-w-xs rounded border mt-3">
            <source src={msg.fileUrl} type={`video/${msg.fileName.split(".").pop()}`} />
          </video>
        )}

        {fileType === "audio" && (
          <audio controls className="w-full mt-3">
            <source src={msg.fileUrl} type={`audio/${msg.fileName.split(".").pop()}`} />
          </audio>
        )}

        <Button
          variant="contained"
          startIcon={<Download />}
          href={msg.fileUrl}
          download
          target="_blank"
          rel="noreferrer"
          sx={{ mt: 2, bgcolor: "#4f46e5", "&:hover": { bgcolor: "#4338ca" } }}
        >
          view File
        </Button>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: "1280px", mx: "auto", p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Chat Messages
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
          sx={{ bgcolor: "#4f46e5", "&:hover": { bgcolor: "#4338ca" }, borderRadius: "50px" }}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          mb: 4,
          p: 3,
          border: "1px solid #e2e8f0",
          bgcolor: "white"
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <FilterAlt sx={{ color: "#4f46e5" }} />
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid >
            <FormControl fullWidth size="small">
              <InputLabel>Message Type</InputLabel>
              <Select
                value={filter.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                label="Message Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="text">Text Only</MenuItem>
                <MenuItem value="file">Files Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid >
            <FormControl fullWidth size="small">
              <InputLabel>Sender Role</InputLabel>
              <Select
                value={filter.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                label="Sender Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid >
            <FormControl fullWidth size="small">
              <InputLabel shrink>Date</InputLabel>
              <input
                type="date"
                value={filter.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={resetFilters}
            sx={{ borderRadius: "50px" }}
          >
            Reset Filters
          </Button>
        </Box>
      </Paper>

      {/* Chat Display */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={50} sx={{ color: "#4f46e5" }} />
        </Box>
      ) : filteredMessages.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            p: 6,
            textAlign: "center",
            border: "1px solid #e2e8f0",
            bgcolor: "white"
          }}
        >
          <Typography variant="h6" color="#64748b" mb={2}>
            No messages found
          </Typography>
          <Typography variant="body2" color="#94a3b8">
            Try changing your filter criteria or check back later
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            p: 3,
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            maxHeight: "600px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          {filteredMessages.map((msg) => {
            const sender = msg.senderId;
      
            const role = msg.RoomId?.members.find((m) => m.user === msg.senderId?._id)?.role || "user";
            const roleColor = role === "admin" ? "#4f46e5" : "#10b981";
            const alignSelf = role === "admin" ? "flex-end" : "flex-start";
            const bubbleColor = role === "admin" ? "#e0e7ff" : "#dcfce7";

            return (
              <Box
                key={msg._id}
                sx={{
                  alignSelf,
                  maxWidth: "70%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1
                }}
              >
                <Box display="flex" gap={1} alignItems="center">
                  <Avatar
                    src={sender?.profileImage || "https://via.placeholder.com/40"}
                    alt={sender?.fullName}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography fontWeight={600}>{sender?.fullName}</Typography>
                  <Chip
                    label={role}
                    size="small"
                    sx={{
                      bgcolor: `${roleColor}20`,
                      color: roleColor,
                      ml: 1,
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: bubbleColor,
                    borderRadius: "16px",
                    p: 2,
                    borderTopLeftRadius: role === "admin" ? "16px" : 0,
                    borderTopRightRadius: role === "admin" ? 0 : "16px"
                  }}
                >
                  {msg.isFile ? renderFilePreview(msg) : (
                    <Typography variant="body1" color="#334155">
                      {msg.text}
                    </Typography>
                  )}
                </Paper>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ alignSelf }}
                >
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
            );
          })}
          <div ref={bottomRef} />
        </Paper>
      )}
    </Box>
  );
};

export default RetrieveChatComp;
