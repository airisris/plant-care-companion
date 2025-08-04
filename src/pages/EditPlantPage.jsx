import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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

function EditPlantPage() {
  const navigate = useNavigate();
  // get plant id from link
  const { id } = useParams();

  // load categories
  const categoriesInLocalStorage =
    JSON.parse(localStorage.getItem("categories")) || [];
  const [categories, setCategories] = useState(
    categoriesInLocalStorage ? categoriesInLocalStorage : []
  );

  const [title, setTitle] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [water, setWater] = useState();
  const [fertilizer, setFertilizer] = useState();
  const [isWater, setIsWater] = useState(false);
  const [isFertilizer, setIsFertilizer] = useState(false);
  const [lastWater, setLastWater] = useState(Date.now());
  const [lastFertilizer, setLastFertilizer] = useState(Date.now());
  const [imageUrl, setImageUrl] = useState("");
  const [updatedAt, setUpdatedAt] = useState(Date.now());
  const [hp, setHp] = useState(100);
  const [personalNote, setPersonalNote] = useState("");

  useEffect(() => {
    // load plant data with plant id
    const notesInLocalStorage = JSON.parse(localStorage.getItem("notes")) || [];
    const plant = notesInLocalStorage.find((note) => note.id === id);

    if (plant) { // check if plant exist
      // insert plant data into useStates or if invalid, default values
      setTitle(plant.title || "");
      setSpecies(plant.species || "");
      setLocation(plant.location || "");
      setCategory(plant.category || "");
      setWater(plant.water || "");
      setFertilizer(plant.fertilizer || "");
      setIsWater(plant.isWater || false);
      setIsFertilizer(plant.isFertilizer || false);
      setLastWater(plant.lastWater || Date.now());
      setLastFertilizer(plant.lastFertilizer || Date.now());
      setImageUrl(plant.imageUrl || "");
      setPersonalNote(
        plant.personalNotes && plant.personalNotes.length > 0
          ? plant.personalNotes
          : "Add your personal notes here!"
      );
      setHp(plant.hp || 100);
      setUpdatedAt(Date.now());
    } else {
      toast.error("Plant not found");
      navigate("/");
    }
  }, [id, navigate]);

  // handle image file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // error checking (if file is invalid)
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      setImageUrl(base64Url);
    };
    reader.readAsDataURL(file);
  };

  // edit plant
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
    // find index of plant in plant list
    const plantIndex = notesInLocalStorage.findIndex((note) => note.id === id);

    if (plantIndex !== -1) { // check if plant exists (index returns -1 if not found)
      const existingPlant = notesInLocalStorage[plantIndex];

      // prepare updated plant
      const updatedPlant = {
        ...existingPlant,
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
        // trim removes white space at the front and end of the string
        personalNotes: personalNote.trim() ? personalNote.trim() : "",
      };

      // set updated plant to the plant with index of updated plant
      notesInLocalStorage[plantIndex] = updatedPlant;
      // update to local storage
      localStorage.setItem("notes", JSON.stringify(notesInLocalStorage));
      toast.success("Plant updated successfully!");
      navigate(`/view/${id}`);
    } else {
      toast.error("Plant not found");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Edit Plant
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
        />
        <TextField
          label="Location (Optional)"
          fullWidth
          color="success"
          margin="normal"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
              if (e.target.value >= 1) {
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
              if (e.target.value >= 1) {
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
          <Box my={2} textAlign="center">
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
          Update Plant
        </Button>
      </Box>
    </Container>
  );
}

export default EditPlantPage;
