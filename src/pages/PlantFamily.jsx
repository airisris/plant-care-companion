import { useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputLabel,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Edit, Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";


function FamilyPage() {

  // load categories
  const dataInLocalStorage = localStorage.getItem("categories");
  const [categories, setCategories] = useState(
    dataInLocalStorage ? JSON.parse(dataInLocalStorage) : []
  );

  // set useState for new category label
  const [label, setLabel] = useState("");

  // add new category
  const handleAddNew = () => {
    // error checking
    if (label === "") {
      toast.error("Please fill in the label");
    } else {
      // prepare updated category list
      const updatedCategories = [
        ...categories,
        {
          id: nanoid(),
          label: label,
        },
      ];
      setCategories(updatedCategories);
      toast.success("New Plant Family has been added");
      // reset the field
      setLabel("");
      // update the local storage with the updated categories
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
    }
  };

  // update category name
  const handleUpdate = (category) => {
    // 5a. prompt the user to update the new label for the selected category (pass in the current value)
    const newCategory = prompt(
      "Please enter the new label for the selected category.",
      category.label
    );
    // update category list with updated category
    if (newCategory) {
      const updatedCategories = [...categories];
      setCategories(
        updatedCategories.map((cat) => {
          if (cat.id === category.id) {
            cat.label = newCategory;
          }
          return cat;
        })
      );
      toast.success("Category has been updated");
      // update the local storage with the updated categories
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
    }
  };

  // delete category
  const handleDelete = (category) => {
    // confirmation alert
    const confirmDelete = confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmDelete) {
      // filter the deleted category from category list
      const updatedCategories = categories.filter(
        (item) => item.id !== category.id
      );

      // update to state and local storage
      setCategories(updatedCategories);
      toast.success("Category has been deleted");
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Typography variant="h4">Manage Plant Categories</Typography>
        <Paper
          elevation={3}
          sx={{
            p: "20px",
            mt: "20px",
          }}
        >
          <InputLabel>Add New Category</InputLabel>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              mt: "5px",
            }}
          >
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
            <Button color="success" variant="contained" onClick={handleAddNew}>
              Add
            </Button>
          </Box>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: "20px",
            mt: "20px",
          }}
        >
          <InputLabel>Existing Categories ({categories.length})</InputLabel>
          <List sx={{ width: "100%" }}>
            {categories.map((category) => (
              <ListItem
                key={category.id}
                disableGutters
                divider
                secondaryAction={
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <IconButton onClick={() => handleUpdate(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category)}>
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={`${category.label}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </>
  );
}

export default FamilyPage;
