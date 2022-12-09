import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import dateFormat from "dateformat";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { v4 as uuidv4 } from 'uuid';


// require('dotenv').config();
// const API_BACKEND = 'http://vps-f0007953.vps.ovh.net:8000';
const API_BACKEND = 'http://localhost:8000';

function Row(props) {
  let today = new Date();
  const { materiel, emprunts, etudiants, setEmprunts, setMateriels, materiels } = props;
  const [open, setOpen] = React.useState(false);
  const [openPopUpCreateEmprunt, setOpenPopUpCreateEmprunt] = useState(false);
  const [newEmpruntStudent, setNewEmpruntStudent] = useState('');
  const [newEmpruntDateDebut, setNewEmpruntDateDebut] = useState(new Date(Date(today.getFullYear(), today.getMonth(), today.getDate())));
  const [newEmpruntDateRendu, setNewEmpruntDateRendu] = useState(new Date(Date(today.getFullYear(), today.getMonth(), today.getDate())));
  const [selectedEtudiant, setSelectedEtudiant] = React.useState('');
  const [currentIdMateriel, setCurrentIdMateriel] = useState('');
  const [disableSaveButton, setDisableSaveButton] = useState(true);


  const cancelEmprunt = (id) => {
    axios.delete(`${API_BACKEND}/api/deleteEmprunt/${id}`)
      .then((res) => {
        console.log(res)
        let temporaryArray = [...emprunts];
        setEmprunts(temporaryArray.filter(item => item.id !== id));
      }).catch((err) => {
        console.log(err)
      })
  }

  const handleChange = (event) => {
    setSelectedEtudiant(event.target.value);
  };

  const findEmprunts = (id, emprunts, etudiants) => {
    let filteredEmprunts = emprunts.filter(emprunt => emprunt.id_materiel === materiel.id)
    if (filteredEmprunts.length > 0) {
      let newFilteredEmprunt = filteredEmprunts.map((emprunt, subindex) => (
        <TableRow key={subindex}>
          <TableCell>{etudiants.find(etudiant => etudiant.id == emprunt.id_etudiant).prenom}</TableCell>
          <TableCell>{etudiants.find(etudiant => etudiant.id == emprunt.id_etudiant).nom}</TableCell>
          <TableCell>{dateFormat(emprunt.date_emprunt, "dd/mm/yyyy")}</TableCell>
          <TableCell>{dateFormat(emprunt.date_rendu, "dd/mm/yyyy")}</TableCell>
          <TableCell style={{ width: 20 }}><IconButton onClick={() => cancelEmprunt(emprunt.id)}><CloseIcon /></IconButton></TableCell>
        </TableRow>
      ))
      return newFilteredEmprunt
    }
  }

  const setOpenPopUpCreateEmpruntFunction = (id) => {
    setCurrentIdMateriel(id);
    setOpenPopUpCreateEmprunt(true);
  }

  const changeStock = (value, id) => {
    let temporaryArray = [...materiels];
    temporaryArray.find(materiel => materiel.id === id).stock = value
    setMateriels(temporaryArray);
    setDisableSaveButton(false);
  }

  const changeName = (value, id) => {
    let temporaryArray = [...materiels];
    temporaryArray.find(materiel => materiel.id === id).nom = value
    setMateriels(temporaryArray);
    setDisableSaveButton(false);
  }

  const updateMateriel = (id) => {
    axios.put(`${API_BACKEND}/api/updateMaterial/${id}`, {
      nom: materiel.nom,
      stock: materiel.stock
    })
      .then((res) => {
        console.log(res)
        setDisableSaveButton(true);
      }).catch((err) => {
        console.log(err)
      })
  }

  const deleteMateriel = (id) => {
    axios.delete(`${API_BACKEND}/api/deleteMaterial/${id}`)
      .then((res) => {
        let temporaryArray = [...materiels];
        setMateriels(temporaryArray.filter(item => item.id !== id))
        let temporaryArray2 = [...emprunts];
        setEmprunts(temporaryArray2.filter(item => item.id_materiel !== id))
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
  }

  const addEmprunt = () => {
    if (selectedEtudiant == '') {
      return
    }
    axios.post(`${API_BACKEND}/api/addEmprunt`, {
      id: uuidv4(),
      id_etudiant: selectedEtudiant,
      id_materiel: currentIdMateriel,
      date_emprunt: newEmpruntDateDebut,
      date_rendu: newEmpruntDateRendu,
    }).then((res) => {
      console.log(res)
      let temporaryArray = [...emprunts];
      temporaryArray.push({
        id: uuidv4(),
        id_etudiant: selectedEtudiant,
        id_materiel: currentIdMateriel,
        date_emprunt: newEmpruntDateDebut,
        date_rendu: newEmpruntDateRendu,
      })
      setEmprunts(temporaryArray);
      setOpenPopUpCreateEmprunt(false);
      setSelectedEtudiant('');
      setNewEmpruntDateDebut(new Date(Date(today.getFullYear(), today.getMonth(), today.getDate())));
      setNewEmpruntDateRendu(new Date(Date(today.getFullYear(), today.getMonth(), today.getDate())));
    }).catch((err) => {
      console.log(err)
      setOpenPopUpCreateEmprunt(false);
    })
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            disabled={emprunts.filter(emprunt => emprunt.id_materiel === materiel.id).length === 0}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ fontSize: '1.1em' }}>
          <TextField
            value={materiel.nom}
            onChange={(e) => changeName(e.target.value, materiel.id)}
            size="small"
            variant="standard"
          />
        </TableCell>
        <TableCell style={{ fontSize: '1.1em', position: 'relative' }}>
          <span>{materiel.stock - emprunts.filter(emprunt => emprunt.id_materiel === materiel.id).length} /</span>
          <TextField
            value={materiel.stock}
            onChange={(e) => changeStock(e.target.value, materiel.id)}
            variant="standard"
            style={{ width: 30, marginLeft: 6, bottom: 21, transform: 'scale(1.1)', position: 'absolute' }}
          />
        </TableCell>
        <TableCell style={{ fontSize: '1.1em' }}><IconButton disabled={materiel.stock - emprunts.filter(emprunt => emprunt.id_materiel === materiel.id).length <= 0} onClick={() => setOpenPopUpCreateEmpruntFunction(materiel.id)}><AddIcon /></IconButton></TableCell>
        <TableCell style={{ fontSize: '1.1em' }}><IconButton onClick={() => deleteMateriel(materiel.id, materiels)}><HighlightOffIcon style={{ color: 'red', opacity: '0.7' }} /></IconButton></TableCell>
        <TableCell style={{ fontSize: '1.1em' }}><Button variant="contained" disabled={disableSaveButton} color="success" onClick={() => updateMateriel(materiel.id, materiels)}>Enregistrer</Button></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Prénom</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Nom</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Date d'emprunt</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Date de rendu</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Supprimer l'emprunt</TableCell>
                  </TableRow>
                </TableHead>
                {etudiants.length !== 0 &&
                  <TableBody>
                    {findEmprunts(materiel.id, emprunts, etudiants)}
                  </TableBody>
                }
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={openPopUpCreateEmprunt}
        onClose={() => setOpenPopUpCreateEmprunt(false)}
      >
        <DialogTitle>Ajouter un emprunt</DialogTitle>
        <TextField
          style={{ margin: 10 }}
          select
          label="Select"
          value={selectedEtudiant}
          onChange={handleChange}
          helperText="Etudiant à sélectionner"
        >
          {etudiants.map((item, index) => (
            <MenuItem key={index} value={item.id}>
              <span style={{ marginRight: 5 }}>{item.prenom}</span>
              <span style={{ marginRight: 5 }}>{item.nom}</span>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          style={{ margin: 10 }}
          // value={newEmpruntDateDebut}
          value={dateFormat(newEmpruntDateDebut, "yyyy-mm-dd'T'HH:MM")}
          type="datetime-local"
          label="date de début"
          onChange={(e) => setNewEmpruntDateDebut(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        // variant='outlined'
        />
        <TextField
          style={{ margin: 10 }}
          value={dateFormat(newEmpruntDateRendu, "yyyy-mm-dd'T'HH:MM")}
          type="datetime-local"
          label="date de rendu"
          onChange={(e) => setNewEmpruntDateRendu(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        // variant='outlined'
        />
        <Button variant="contained" style={{ borderRadius: 0, marginTop: 10 }} onClick={() => addEmprunt()}>Valider</Button>
      </Dialog>
    </>
  );
}

export default function App() {
  const [popUpMateriel, setPopUpMateriel] = useState(false);
  const [newMaterielName, setNewMaterielName] = useState('');
  const [newMaterielStock, setNewMaterielStock] = useState(0);

  const [materiels, setMateriels] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios.get(`${API_BACKEND}/api/getAllMateriels`
    ).then((res) => {
      setMateriels(res.data);
    }).catch((err) => {
      console.log(err)
    })
    axios.get(`${API_BACKEND}/api/getStudents`
    ).then((res) => {
      setEtudiants(res.data);
    }).catch((err) => {
      console.log(err)
    })
    axios.get(`${API_BACKEND}/api/getAllEmprunts`
    ).then((res) => {
      setEmprunts(res.data);
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const addMateriel = () => {
    let uniqueId = uuidv4();
    if (newMaterielName == undefined || newMaterielName == '' || newMaterielStock == 0) {
      return
    }
    axios.post(`${API_BACKEND}/api/addMateriel`, {
      id: uniqueId,
      nom: newMaterielName,
      stock: newMaterielStock,
    }).then((res) => {
      console.log(res)

      let temporaryArray = [...materiels];
      temporaryArray.push({
        id: uniqueId,
        nom: newMaterielName,
        stock: newMaterielStock,
      })

      setMateriels(temporaryArray);
      setPopUpMateriel(false);
      setNewMaterielName('');
      setNewMaterielStock(0);
    }).catch((err) => {
      console.log(err)
      setPopUpMateriel(false);
      setNewMaterielName('');
      setNewMaterielStock(0);
    })
  }

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell style={{ fontWeight: 600, fontSize: '1.1em' }}>Matériel</TableCell>
              <TableCell style={{ fontWeight: 600, fontSize: '1.1em' }}>Stock</TableCell>
              <TableCell style={{ fontWeight: 600, fontSize: '1.1em' }}>Ajouter un emprunt</TableCell>
              <TableCell style={{ fontWeight: 600, fontSize: '1.1em' }}>Supprimer le matériel</TableCell>
              <TableCell style={{ fontWeight: 600, fontSize: '1.1em' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materiels.map((materiel, index) => (
              <Row
                key={index}
                materiel={materiel}
                materiels={materiels}
                setMateriels={setMateriels}
                emprunts={emprunts}
                setEmprunts={setEmprunts}
                etudiants={etudiants}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button style={{ margin: 10 }} onClick={() => setPopUpMateriel(true)} variant="contained" color="success">
        Ajouter du matériel
      </Button>
      <Dialog open={popUpMateriel} onClose={() => setPopUpMateriel(false)}>
        <DialogTitle>Ajouter du matériel</DialogTitle>
        <TextField
          style={{ margin: 10 }}
          value={newMaterielName}
          label="nom"
          onChange={(e) => setNewMaterielName(e.target.value)}
          variant='outlined'
        />
        <TextField
          style={{ margin: 10 }}
          value={newMaterielStock}
          label="stock"
          onChange={(e) => setNewMaterielStock(e.target.value)}
          variant='outlined'
          type="number"
        />
        <Button variant="contained" style={{ borderRadius: 0, marginTop: 10 }} onClick={() => addMateriel()}>Valider</Button>
      </Dialog>
    </Container>
  )
}