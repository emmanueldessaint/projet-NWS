import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import nock from 'nock';
import axios from "axios";
import supertest from 'supertest';

jest.mock("./api");

// import renderer from 'react-test-renderer';

test('boutons et affichage du tableau', () => {
  render(<App />);
  expect(
    screen.getByText("Matériel")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Stock")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Ajouter un emprunt")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Supprimer le matériel")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Ajouter du matériel")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Ajouter / supprimer un étudiant")
  ).toBeInTheDocument();
});

const request = require('supertest')('http://vps-f0007953.vps.ovh.net:8000/api');
const assert = require('chai').assert;

describe("test de l'api", () => {
  it('GET / materiels', () => {
    return request.get('/getAllMateriels').expect(200);
  })
  it('GET / emprunts', () => {
    return request.get('/getAllEmprunts').expect(200);
  })
  it('GET / étudiants', () => {
    return request.get('/getAllStudents').expect(200);
  })
  it('POST / emprunt', () => {
    const data = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      id_etudiant: "124e4567-e89b-12d3-a456-426614174000",
      id_materiel: "125e4567-e89b-12d3-a456-426614174000",
      date_emprunt: "2022-11-13T17:45:04.000Z",
      date_rendu: "2022-11-13T17:45:04.000Z",
    };
    return request
      .post('/addEmprunt')
      .send(data)
      .then((res) => {
        // assert.equal("123e4567-e89b-12d3-a456-426614174000", data.id);
        if (res.status !== 201) {
          throw error
        }
      });
  });
  it('POST / matériel', () => {
    const data2 = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      nom: "pc portable",
      stock: 15,
    };
    return request
      .post('/addMateriel')
      .send(data2)
      .then((res) => {
        // assert.equal("123e4567-e89b-12d3-a456-426614174000", data.id);
        if (res.status !== 201) {
          throw error
        }
      });
  });
  it('POST / étudiant', () => {
    const data3 = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      nom: "Emmanuel",
      mail: "emmanueldessaint2722@gmail.com",
      prenom: "Emmanuel",
      annee: "A3 DEV"
    };
    return request
      .post('/addEtudiant')
      .send(data3)
      .then((res) => {
        // assert.equal("123e4567-e89b-12d3-a456-426614174000", data.id);
        if (res.status !== 201) {
          throw error
        }
      });
  });
});

