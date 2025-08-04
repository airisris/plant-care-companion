import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Editor from "react-simple-wysiwyg";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AddPlantPage() {
  const navigate = useNavigate();

  // load categories
  const categoriesInLocalStorage =
    JSON.parse(localStorage.getItem("categories")) || [];
  const [categories, setCategories] = useState(
    categoriesInLocalStorage ? categoriesInLocalStorage : []
  );

  // set useState
  const [title, setTitle] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(
    categoriesInLocalStorage.length > 0 ? categoriesInLocalStorage[0].id : ""
  );
  const [water, setWater] = useState();
  const [fertilizer, setFertilizer] = useState();
  const [isWater, setIsWater] = useState(false);
  const [isFertilizer, setIsFertilizer] = useState(false);
  const [lastWater, setLastWater] = useState(0);
  const [lastFertilizer, setLastFertilizer] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [updatedAt, setUpdatedAt] = useState(Date.now());
  const [personalNote, setPersonalNote] = useState(
    "Add your personal notes here!"
  );
  const [hp, setHp] = useState(100);

  // Optionally load saved image on mount
  useEffect(() => {
    const savedImage = localStorage.getItem("uploadedPlantSelfie");
    if (savedImage) setImageUrl(savedImage);
  }, []);

  // save image file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      setImageUrl(base64Url);
      localStorage.setItem("uploadedPlantSelfie", base64Url);
    };
    reader.readAsDataURL(file);
  };

  // create new plant
  const handleSubmit = (e) => {
    e.preventDefault();

    // error checking
    if (!title) {
      toast.error("Please enter a plant name");
      return;
    }
    if (!water) {
      toast.error("Please enter watering frequency (days)");
      return;
    }
    if (!fertilizer) {
      toast.error("Please enter fertilizer frequency (days)");
      return;
    }

    // load plant list from local storage
    const notesInLocalStorage = JSON.parse(localStorage.getItem("notes")) || [];

    // prepare new plant
    const newNote = {
      id: nanoid(),
      title,
      species,
      location,
      category,
      fertilizer,
      isFertilizer,
      lastFertilizer,
      water,
      isWater,
      lastWater,
      imageUrl,
      updatedAt,
      hp,
      growthJournal: [
        { id: nanoid(), d: Date.now(), text: "Plant profile was created!" }, // default 1st journal entry
      ],
      personalNotes: personalNote.trim()
        ? personalNote.trim()
        : "Add your personal notes here!",
    };

    // save to local storage
    localStorage.setItem(
      "notes",
      JSON.stringify([newNote, ...notesInLocalStorage])
    );
    toast.success("Plant added successfully!");

    // clear saved image after adding
    localStorage.removeItem("uploadedPlantSelfie");

    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Add New Plant
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        sx={{ mt: 3 }}
      >
        <TextField
          label="Plant Name"
          fullWidth
          color="success"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Species (Optional)"
          fullWidth
          color="success"
          margin="normal"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          required
        />
        <TextField
          label="Location (Optional)"
          fullWidth
          color="success"
          margin="normal"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <Box sx={{ display: "flex" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              color="success"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ height: "55px", mt: "16px", ml: "10px" }}
            component={RouterLink}
            to="/family"
            color="success"
          >
            <AddIcon />
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "20px",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Water every... (Days)"
            margin="normal"
            fullWidth
            color="success"
            type="number"
            value={water}
            onChange={(e) => {
              if (e.target.value >= 1) { // make sure value is not negative
                setWater(e.target.value);
              }
            }}
            required
          />
          <TextField
            label="Fertilize every... (Days)"
            margin="normal"
            type="number"
            fullWidth
            color="success"
            value={fertilizer}
            onChange={(e) => {
              if (e.target.value >= 1) { // make sure value is not negative
                setFertilizer(e.target.value);
              }
            }}
            required
          />
        </Box>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          margin="normal"
          tabIndex={-1}
          fullWidth
          color="success"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: "10px" }}
        >
          Upload Plant Selfie!
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple={false}
            accept="image/*"
          />
        </Button>

        {imageUrl && (
          <Box mt={2} textAlign="center">
            <img
              src={imageUrl}
              alt="Plant Selfie Preview"
              style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
            />
          </Box>
        )}

        <Box sx={{ mt: "20px" }}>
          <Editor
            containerProps={{ style: { height: "300px" } }}
            value={personalNote}
            onChange={(event) => setPersonalNote(event.target.value)}
          />
        </Box>

        <br />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          color="success"
        >
          Add Plant
        </Button>
      </Box>
    </Container>
  );
}

export default AddPlantPage;
