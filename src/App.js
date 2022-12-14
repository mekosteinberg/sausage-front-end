import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Box, Button, Container, Grid, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import SausageList from './SausageList';
import SausageForm from './SausageForm';
import SausageModal from './SausageModal';
import BrewerySearch from './BrewerySearch';

const client = axios.create({ baseURL: 'https://rate-my-brat-api.herokuapp.com/api' })

//-----------------
//Footer Theme
//-----------------
const theme = createTheme();


//-----------------
// PAGE CONTENT
//-----------------
const App = () => {

  //-----------------
  // Setup UseState
  //-----------------
  const [sausages, setSausages] = useState([])

  //-----------------
  // NAV Buttons
  //-----------------
  const [areSausagesVisible, setAreSausagesVisible] = useState(true)
  const [isAddSausageVisible, setAddSausageVisible] = useState(false)
  const [isBrewSearchVisible, setBrewSearchVisible] = useState(false)

  const showSausages = () => {
    setAreSausagesVisible(true)
    setAddSausageVisible(false)
    setBrewSearchVisible(false)
  }
  const showAddSausages = () => {
    setAreSausagesVisible(false)
    setAddSausageVisible(true)
    setBrewSearchVisible(false)
  }
  const showDrinks = () => {
    setAreSausagesVisible(false)
    setAddSausageVisible(false)
    setBrewSearchVisible(true)
  }

  const handleNewSausageFormSubmit = () => {
    showSausages()
    client
      .get('/sausages')
      .then((response) => {
        setSausages(response.data)
      })
  }

  //----------------
  //EDIT Sausage Input
  //----------------
  const [showModal, setShowModal] = useState(false)
  const [sausage, setSausage] = useState({})
  const editSausage = (sausageToEdit) => {
    setShowModal(true)
    setSausage(sausageToEdit)
  }

  const handleEditFormSubmit = () => {
    setShowModal(false)
    client
      .get('/sausages')
      .then((response) => {
        setSausages(response.data)
      })
  }

  //----------------
  //DELETE Sausage Input
  //----------------
  const deleteSausage = () => {
    client
      .get('/sausages')
      .then((response) => {
        setSausages(response.data)
        showSausages()
        setShowModal(false)
      })
  }

  //----------------
  //RESET Form Input
  //----------------


  useEffect(() => {
    client.get('/sausages').then((response) => {
      setSausages(response.data)
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Paper>
          <AppBar position="static" sx={{ m: 2, ml: 0, p: 2, bgcolor: 'secondary' }}>
            <Toolbar>
              <CameraIcon sx={{ mr: 2 }} />
              <Typography variant="h3">Rate my Brat!</Typography>
              <Typography sx={{ p: 3 }} variant="h6">Welcome to Octoberfest</Typography>
            </Toolbar>
          </AppBar>
        </Paper>

        <main>
          {/* Hero unit */}
          <Box
            sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h3"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
              >Brat Time</Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Its Octoberfest! Everyone loves to take pics of their food, here's a way to rate your Octoberfest Feasts! Upload pics, say how it was and rate it 1-5 stars. Dont forget to check out the beverages section to find your perfect pairing!
              </Typography>
              <Stack sx={{ p: 2 }} direction="row" spacing={2} justifyContent="center" >
                <Button variant={areSausagesVisible ? "contained" : "outlined"} onClick={showSausages}>The Goods</Button>
                <Button variant={isAddSausageVisible ? "contained" : "outlined"} onClick={showAddSausages}>Rate your own!</Button>

              </Stack>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                What goes better with brats than Beer? Find a brewery near you!
              </Typography>
              <Stack sx={{ p: 2 }} direction="row" spacing={2} justifyContent="center">
                <Button variant={isBrewSearchVisible ? "contained" : "outlined"} onClick={showDrinks}>Perfect Pairings</Button>
              </Stack>
            </Container>
          </Box>
          <Container maxWidth="md">
          
            {areSausagesVisible
              && <SausageList sausages={sausages} onEditClick={editSausage} />}


            {isAddSausageVisible
              &&
              <SausageForm onSubmit={handleNewSausageFormSubmit} />
            }

            {isBrewSearchVisible && <BrewerySearch/>}

          </Container>

          <SausageModal
            open={showModal}
            onClose={() => { setShowModal(false) }}
            sausage={sausage}
            onDelete={deleteSausage}
            onSubmit={handleEditFormSubmit} />

        </main>
        <Box
          component="footer"
          sx={{
            py: 3, px: 2, mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[400]
                : theme.palette.grey[800],
          }}>
          <Container maxWidth="sm">
            <Typography variant="body1">
              Brought to you by A.Champion and M.Steinberg
            </Typography>
          </Container>
        </Box>
      </Container>
    </ThemeProvider>
  );

}


export default App;
