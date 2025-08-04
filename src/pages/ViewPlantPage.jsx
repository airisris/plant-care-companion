import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CardMedia,
  Stack,
  Card,
  Divider,
  Fab,
  TextField,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import { nanoid } from "nanoid";
import { toast } from "sonner";

function ViewPlantPage() {
  // get plant id from url
  const { id } = useParams();
  const navigate = useNavigate();

  // load plant list from local storage
  const notesInLocalStorage = localStorage.getItem("notes");
  const [notes, setNotes] = useState(
    notesInLocalStorage ? JSON.parse(notesInLocalStorage) : []
  );

  // find plant with plant id
  const selectedNote = notes.find((n) => n.id === id);

  // if id is invalid / doesnt exist
  if (!selectedNote) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h5">Plant not found.</Typography>
        <Button
          onClick={() => navigate("/")}
          sx={{ mt: 2, backgroundColor: "gray" }}
          variant="outlined"
        >
          Go Home
        </Button>
      </Container>
    );
  }

  // load categories from local storage
  const categoriesInLocalStorage = localStorage.getItem("categories");
  const categories = categoriesInLocalStorage
    ? JSON.parse(categoriesInLocalStorage)
    : [];

  // get category label from plant category value (id)
  const selectedCategory = categories.find(
    (c) => c.id === selectedNote.category
  );
  const categoryLabel = selectedCategory
    ? selectedCategory.label
    : "No Category";

  // set growth journal to plant's growth journal in local storage
  const growthJournal = selectedNote.growthJournal || [];

  // navigate to edit page
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  // delete plant
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      navigate("/");
    }
  };

  // set useStates for add GJ input and GJ input modal
  const [openModalGJ, setOpenModalGJ] = useState(false);
  const [growthJournalInput, setGrowthJournalInput] = useState("");

  // when click add button, set input state to empty and modal state to true
  const handleOpenGJ = () => {
    setGrowthJournalInput("");
    setOpenModalGJ(true);
  };

  // when close the modal, set open modal to false
  const handleCloseGJ = () => setOpenModalGJ(false);

  // insert new GJ input
  const handleSubmitGJ = () => {
    // prepare new GJ input
    const newGJinput = {
      id: nanoid(),
      d: Date.now(),
      text: growthJournalInput,
    };

    // prepare updated GJ array
    const newGJ = [...growthJournal, newGJinput];

    // prepare updated plant object
    const updatedPlant = {
      ...selectedNote,
      growthJournal: newGJ,
    };

    // update plant into plants array
    const updatedNotes = notes.map((note) =>
      note.id === id ? updatedPlant : note
    );

    // update to local storage
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    // Then clear input and close modal
    handleCloseGJ();
  };

  // delete GJ entry
  const handleDeleteGJ = (entryId) => {
    // confirmation alert
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      // remove entry from GJ array with filtering
      const newGJ = selectedNote.growthJournal.filter((n) => n.id !== entryId);
      // prepare updated plant with updated GJ
      const updatedNote = {
        ...selectedNote,
        growthJournal: newGJ,
      };
      // update plant to plant list and save to local storage
      const updatedNotes = notes.map((n) => (n.id === id ? updatedNote : n));
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }
  };
  return (
    <Container sx={{ mt: 4, mb: 4, maxWidth: "md" }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3, color: "gray", borderColor: "gray" }}
        variant="outlined"
      >
        Back
      </Button>

      {/* Section 1: Flex container with image & description + edit/delete buttons */}
      <Card
        elevation={5}
        sx={{
          maxWidth: 900,
          margin: "0 auto",
          mb: 4,
          px: { xs: 2, sm: 5 },
          py: { xs: 3, sm: 4 },
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            width: "100%",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: { xs: "100%", sm: 300 },
              height: 300,
              borderRadius: 2,
              objectFit: "cover",
              maxWidth: 300,
            }}
            image={selectedNote.imageUrl || "/src/assets/default.jpg"}
            alt={selectedNote.title}
          />

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
              {selectedNote.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "canter",
              }}
            >
              <Chip
                size="small"
                label={selectedNote.species ? selectedNote.species : "No Species"}
                sx={{
                  mb: "3px",
                  mx: "5px",
                  backgroundColor: "#cce5cc",
                  color: "#2b4d2b",
                  fontWeight: "medium",
                }}
              />
              <Chip
                size="small"
                label={selectedNote.location ? selectedNote.location : "No Location"}
                sx={{
                  mb: "3px",
                  mx: "5px",
                  backgroundColor: "#cce5cc",
                  color: "#2b4d2b",
                  fontWeight: "medium",
                }}
              />
            </Box>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              gutterBottom
              textAlign="center"
            >
              Category: {categoryLabel}
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                color="success"
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>

      <Divider sx={{ mb: 4 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          mb: 6,
          maxWidth: 900,
          mx: "auto",
          flexWrap: { xs: "wrap", sm: "nowrap" }, // wrap on small screens, row on larger
        }}
      >
        {/* Water (times/week) */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            minWidth: 150,
            height: 150,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Water (every ... days)
          </Typography>
          <Typography variant="h5">{selectedNote.water}</Typography>
        </Paper>

        {/* Image */}
        <CardMedia
          component="img"
          image={selectedNote.imageUrl || "/src/assets/default.jpg"}
          alt={selectedNote.title}
          sx={{
            height: 150,
            width: 170,
            borderRadius: 2,
            objectFit: "cover",
          }}
        />

        {/* Fertilize (times/week) */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            minWidth: 150,
            height: 150,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Fertilize (every ... days)
          </Typography>
          <Typography variant="h5">{selectedNote.fertilizer}</Typography>
        </Paper>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Section 3. Growth Journal Timeline */}
      <Card
        elevation={4}
        sx={{
          mb: 4,
          px: { xs: 2, sm: 5 },
          py: { xs: 3, sm: 4 },
          borderRadius: 4,
          maxWidth: 900,
          minHeight: 200,
          mx: "auto",
          display: "flex",
        }}
      >
        <Box sx={{ width: "50%", height: "100%" }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            Growth Journal
            <Fab
              sx={{ mx: "20px" }}
              size="small"
              color="success"
              onClick={handleOpenGJ}
            >
              <AddIcon />
            </Fab>
            <Modal
              open={openModalGJ}
              onClose={handleCloseGJ}
              aria-labelledby="growth-journal-title"
              aria-describedby="growth-journal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 3,
                }}
              >
                <Typography variant="h5">Add to Growth Journal</Typography>
                <TextField
                  id="growth-journal-description"
                  label="Journal Entry"
                  multiline
                  minRows={2}
                  fullWidth
                  value={growthJournalInput}
                  onChange={(e) => setGrowthJournalInput(e.target.value)}
                  variant="outlined"
                />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                  <Button variant="outlined" onClick={handleCloseGJ}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmitGJ}
                    disabled={!growthJournalInput.trim()}
                  >
                    Add Entry
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Typography>
          <Timeline sx={{ maxHeight: "200px", overflowY: "scroll" }}>
            {[...growthJournal]
              .sort((a, b) => b.d - a.d) // descending order (most recent first)
              .map((note) => (
                <TimelineItem key={note.id}>
                  <TimelineOppositeContent color="text.secondary">
                    {dayjs(note.d).format("DD/MM/YY")}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <Fab
                      size="small"
                      color="error"
                      onClick={() => handleDeleteGJ(note.id)}
                      aria-label="delete"
                      sx={{
                        width: 30,
                        height: 30,
                        minWidth: 30,
                        minHeight: 30,
                      }}
                    >
                      <DeleteIcon fontSize="20px" />
                    </Fab>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>{note.text}</TimelineContent>
                </TimelineItem>
              ))}
          </Timeline>
        </Box>
        <Divider sx={{ mb: 4 }} />

        {/* Section 4. Personal Notes */}
        <Box sx={{ width: "50%", marginLeft: "20px" }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            Personal Notes
          </Typography>

          {selectedNote.personalNotes &&
          selectedNote.personalNotes.trim() !== "" &&
          selectedNote.personalNotes !== "<br>" ? (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: "background.default",
                maxWidth: 600,
                mx: "auto",
              }}
            >
              <Box
                component="div"
                sx={{
                  whiteSpace: "pre-wrap",
                }}
                dangerouslySetInnerHTML={{
                  __html: selectedNote.personalNotes,
                }}
              />
            </Paper>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              No personal notes yet.
            </Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}

export default ViewPlantPage;
