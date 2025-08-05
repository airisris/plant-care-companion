import { useState } from "react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Link as RouterLink } from "react-router";
import {
  Typography,
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Fab,
  Grid,
  useTheme,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

function HomePage() {
  const theme = useTheme();

  // load plants
  const notesInLocalStorage = localStorage.getItem("notes");
  const [notes, setNotes] = useState(
    notesInLocalStorage ? JSON.parse(notesInLocalStorage) : []
  );

  // load categories
  const categoriesInLocalStorage = localStorage.getItem("categories");
  const [categories, setCategories] = useState(
    categoriesInLocalStorage ? JSON.parse(categoriesInLocalStorage) : []
  );

  // set useStates for filter/sort
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  // function to get category label with category id
  const getCategoryLabel = (catID) => {
    const selectedCategory = categories.find((c) => c.id === catID.category);
    if (selectedCategory) {
      // error checking
      return selectedCategory.label;
    } else {
      return "No Category";
    }
  };

  // delete plant
  const handleNoteDelete = (plant) => {
    // confirmation alert
    const confirmDelete = confirm(
      "Are you sure this teeny weeny plant is dead?"
    );
    if (confirmDelete) {
      // remove plant from plant list and set to localstorage
      const updatedNotes = notes.filter((item) => item.id !== plant.id);
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      toast.success("Plant has been deleted");
    }
  };

  // update isWater to show alert button if needed
  useEffect(() => {
    let hasChanged = false;
    const today = dayjs(Date.now()).startOf("date");
    const updatedNotes = notes.map((note) => {
      note.isWater = false;
      note.isFertilizer = false;
      // format and assign
      const lastWaterDate = dayjs(note.lastWater).startOf("date");
      const lastFertilizerDate = dayjs(note.lastFertilizer).startOf("date");
      // today - last water date
      const daysSinceLastWater = today.diff(lastWaterDate, "day");
      const daysSinceLastFertilizer = today.diff(lastFertilizerDate, "day");
      // c1: lastWater is 0, set to isWater = true
      // c2: daysincelaswater >= note.water
      // c3: specify for note.water = 1, lastwaterdate is not today
      if (
        note.lastWater <= 0 ||
        daysSinceLastWater >= Number(note.water) ||
        (Number(note.water) === 1 &&
          today.valueOf() !== lastWaterDate.valueOf())
      ) {
        hasChanged = true;
        // return { ...note, isWater: true };
        note.isWater = true;
      }

      if (
        daysSinceLastWater > Number(note.water) ||
        (note.water === 1 && daysSinceLastWater === 1)
      ) {
        // decrease by 10 every day missed water
        const decreaseHp = (daysSinceLastWater - Number(note.water)) * 10;
        const newHp = Math.max(0, 100 - decreaseHp); // make sure hp is not negative
        note.hp = newHp;
      }

      if (
        note.lastFertilizer <= 0 ||
        daysSinceLastFertilizer >= Number(note.fertilizer) ||
        (Number(note.fertilizer) === 1 &&
          today.valueOf() !== lastFertilizerDate.valueOf())
      ) {
        hasChanged = true;
        // return { ...note, isFertilizer: true };
        note.isFertilizer = true;
      }

      if (
        daysSinceLastFertilizer > Number(note.fertilizer) ||
        (note.fertilizer === 1 && daysSinceLastFertilizer === 1)
      ) {
        const decreaseHp =
          (daysSinceLastFertilizer - Number(note.fertilizer)) * 10;
        const newHp = Math.max(0, 100 - decreaseHp);
        note.hp = newHp;
      }

      // if just created plant, set hp to 100
      if (note.lastWater == "0" && note.lastFertilizer == "0") {
        note.hp = 100;
      }
      // skip if false
      return note;
    });

    if (hasChanged) {
      // set to localstorage
      setNotes(updatedNotes);
    }
  }, []);
  console.log(notes);

  // set useStates for alerts
  const [alertNote, setAlertNote] = useState(null);

  // open alert for specific plant
  const handleOpenAlert = (note) => setAlertNote(note);
  const handleCloseAlert = () => setAlertNote(null);

  // update isWater to false when task (alert) is done
  const handleDoneWater = (note) => {
    const updatedNotes = notes.map((item) => {
      // find which plant by plant id
      if (item.id === note.id) {
        // prepare updated plant
        const updatedItem = {
          ...item,
          isWater: false,
          lastWater: dayjs(Date.now()),
        };

        // check if isFertilizer is true, if true, hp not 100, else 100
        if (!updatedItem.isFertilizer && !updatedItem.isWater) {
          // set hp back to 100
          updatedItem.hp = 100;
        }

        return updatedItem;
      }
      // ignore function for other plants
      return item;
    });
    // update to localstorage
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    handleCloseAlert();
    toast.success(`${note.title} has been watered! 💧`);
  };

  // same with update isWater to false when done but with isFertilizer
  const handleDoneFertilizer = (note) => {
    const updatedNotes = notes.map((item) => {
      if (item.id === note.id) {
        const updatedItem = {
          ...item,
          isFertilizer: false,
          lastFertilizer: dayjs(Date.now()),
        };

        if (!updatedItem.isFertilizer && !updatedItem.isWater) {
          updatedItem.hp = 100;
        }

        return updatedItem;
      }
      return item;
    });
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    handleCloseAlert();
    toast.success(`${note.title} has been fertilized! 🌱`);
  };

  // hp bar styling
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "#4caf50",
      ...theme.applyStyles("dark", {
        backgroundColor: "#4caf50",
      }),
    },
  }));

  // prepare filtered plants
  const filteredPlants = notes
    .filter((n) => {
      if (selectedCategory === "all") {
        return true;
      } else if (n.category === selectedCategory) {
        return true;
      }
      return false;
    })
    .sort((a, b) => {
      if (sortBy === "updated") {
        return b.updatedAt - a.updatedAt;
      } else if (sortBy === "title") {
        const titleA = (a.title || "").toLowerCase();
        const titleB = (b.title || "").toLowerCase();
        return titleA.localeCompare(titleB);
      } else if (sortBy === "urgency") {
        const urgencyA = (a.isWater ? 1 : 0) + (a.isFertilizer ? 1 : 0);
        const urgencyB = (b.isWater ? 1 : 0) + (b.isFertilizer ? 1 : 0);

        if (urgencyA > urgencyB) return -1;
        if (urgencyA < urgencyB) return 1;

        return b.updatedAt - a.updatedAt;
      }
    });
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        {/* add plant button */}
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/add"
          sx={{ fontWeight: "bold" }}
        >
          Add Plant
        </Button>

        {/* filter by category */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel
              id="category-select-label"
              sx={{ bgcolor: "white", px: 1 }}
            >
              Category
            </InputLabel>
            <Select
              id="category-select"
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* filter by "sort by" */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel sx={{ bgcolor: "white", px: 1 }}>Sort By</InputLabel>
            <Select
              id="sort-select"
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="updated">Last Updated</MenuItem>
              <MenuItem value="title">Name</MenuItem>
              <MenuItem value="urgency">Urgency</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* notes grid */}
      <Grid container spacing={3} sx={{ alignItems: "" }}>
        {filteredPlants.length === 0 ? (
          <Card sx={{ p: "20px", width: "100%" }}>
            <Typography sx={{ textAlign: "c" }}> No Plants Found </Typography>
          </Card>
        ) : (
          filteredPlants.map((note) => (
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={note.id}>
              <Card
                sx={{
                  position: "relative",
                  bgcolor: "#eaf4ea",
                  boxShadow: theme.shadows[3],
                  borderRadius: 3,
                  overflow: "visible",
                  minHeight: 300,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                elevation={3}
              >
                {/* alert shown if condition met */}
                {(note.isWater === true || note.isFertilizer === true) && (
                  <Fab
                    size="small"
                    color="error"
                    aria-label="edit"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 10,
                    }}
                    onClick={() => handleOpenAlert(note)} // pass the note here
                  >
                    <PriorityHighIcon fontSize="small" />
                  </Fab>
                )}

                <Modal
                  open={!!alertNote} // convert to true boolean
                  onClose={handleCloseAlert}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 300,
                      bgcolor: "background.paper",
                      border: "2px solid #000",
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 3,
                    }}
                  >
                    {/* show modal for isWater */}
                    {alertNote?.isWater && ( // only run if alertNote is not undefined/null
                      <>
                        <Typography id="modal-modal-title" variant="h6">
                          {alertNote.title} is thirsty!
                        </Typography>
                        <Box
                          sx={{
                            mb: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            id="modal-modal-description"
                            sx={{ mt: 2 }}
                          >
                            Give 'em some water 🚿
                          </Typography>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => handleDoneWater(alertNote)}
                          >
                            <DoneIcon sx={{ width: "20px" }} />
                            Done
                          </Button>
                        </Box>
                      </>
                    )}
                    {/* show modal for isFertilizer */}
                    {alertNote?.isFertilizer && (
                      <>
                        <Typography id="modal-modal-title" variant="h6">
                          {alertNote.title} needs food!
                        </Typography>
                        <Box
                          sx={{
                            mb: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            id="modal-modal-description"
                            sx={{ mt: 2 }}
                          >
                            Give 'em some fertilizer 💩
                          </Typography>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => handleDoneFertilizer(alertNote)}
                          >
                            <DoneIcon sx={{ width: "20px" }} />
                            Done
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </Modal>

                <CardMedia
                  component="img"
                  height="250px"
                  image={note.imageUrl || "/src/assets/default.jpg"}
                  sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  alt={note.title || "Plant image"}
                />

                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "600", color: "#2e5d2e" }}
                  >
                    {note.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={getCategoryLabel(note)}
                    sx={{
                      my: 1,
                      backgroundColor: "#cce5cc",
                      color: "#2b4d2b",
                      fontWeight: "medium",
                    }}
                  />
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ fontWeight: "600", color: "#2e5d2e", my: 1 }}
                  >
                    HP
                    <AddIcon />
                  </Typography>
                  <BorderLinearProgress
                    sx={{
                      bgcolor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          note.hp < 30
                            ? "#f44336"
                            : note.hp < 50
                            ? "#ffeb3b"
                            : "#4caf50",
                      },
                    }}
                    variant="determinate"
                    value={note.hp}
                    color="#e0e0e0"
                  />
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "flex-start", pb: 2, px: 2 }}
                >
                  <Button
                    size="small"
                    color="primary"
                    component={RouterLink}
                    to={`/view/${note.id}`}
                  >
                    <VisibilityIcon sx={{ width: "20px" }} />
                    View
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleNoteDelete(note)}
                  >
                    <DeleteIcon sx={{ width: "20px" }} />
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default HomePage;
