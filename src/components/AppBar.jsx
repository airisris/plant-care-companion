import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Link as RouterLink, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

const PlantLogo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  marginRight: theme.spacing(1.5),
  position: 'relative',
  '&::before': {
    content: '"🌱"',
    fontSize: '20px',
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
  }
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #4CAF50 100%)',
  boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: 'white',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '8px',
  padding: theme.spacing(1, 2),
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  }
}));

const pages = [
  {
    label: "All Plants",
    url: "/",
  },
  {
    label: "Add A Plant",
    url: "/add",
  },
  {
    label: "Add Category",
    url: "/family",
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center' }}>
            <PlantLogo />
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: '"Poppins", "Roboto", sans-serif',
                fontWeight: 600,
                fontSize: '1.5rem',
                letterSpacing: '0.5px',
                color: 'white',
                textDecoration: 'none',
                background: 'linear-gradient(45deg, #ffffff 30%, #e8f5e8 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Grow A Garden
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ 
                display: { xs: "block", md: "none" },
                '& .MuiPaper-root': {
                  backgroundColor: 'rgba(29, 85, 32, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  marginTop: '8px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.url}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.url);
                  }}
                  sx={{
                    color: 'white',
                    padding: '12px 20px',
                    margin: '4px 8px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}
                  >
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: 'center', flexGrow: 1 }}>
            <PlantLogo />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: '"Poppins", "Roboto", sans-serif',
                fontWeight: 600,
                fontSize: '1.2rem',
                letterSpacing: '0.5px',
                color: 'white',
                textDecoration: 'none',
                background: 'linear-gradient(45deg, #ffffff 30%,rgb(229, 246, 229) 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Grow A Garden
            </Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              alignItems: 'center'
            }}
          >
            {pages.map((page) => (
              <NavButton
                component={RouterLink}
                to={page.url}
                key={page.url}
                onClick={handleCloseNavMenu}
              >
                {page.label}
              </NavButton>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
export default ResponsiveAppBar;
