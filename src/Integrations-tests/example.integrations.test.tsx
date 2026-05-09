// Bespiel: testet ein Komponent der die word data von der API holt und anzeigt

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TestDatabaseContainer } from './containers/database.container';

describe('Hangman Integration Tests', () => {
  let dbContainer: TestDatabaseContainer;

  //Setup: Startet einmal vor allen tests in diesem File
    beforeAll(async () => {
    dbContainer = new TestDatabaseContainer();
    const connectionString = await dbContainer.start();
    //übergibt die connection string an die app via env oder context
    process.env.DATABASE_URL = connectionString;
  });

  //cleanup: Läuft NACHDEM alle Tests dertig sind
    afterAll(async () => {
    await dbContainer.stop();
    });

    it('should load word form database and render hangman', async () => {
        //dieser Test nutzt die ECHTE database (im container)
        //wird nicht gemockt wie die Unit tests

        render(<Hangman />);

        //warten für die komponente um fetch word von DB
        await waitFor(() => {
      expect(screen.getByText(/word loaded/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should handle wrong guesses correctly', async () => {
    //Stoppt den container tempoär um eine DB failure zu simulieren
    await dbContainer.stop();

    render(<Hangman />);

    //Bestätigt error handling
    await waitFor(() => {
      expect(screen.getByText(/connection error/i)).toBeInTheDocument();
    });

    //Startet neu für nächsten Test
    await dbContainer.start();
});
});