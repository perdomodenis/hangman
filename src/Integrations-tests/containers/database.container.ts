// Das File kreiert und managed eine test database container 
// es wird genutzt um mehrere tests zu laufen ohne die echte database zu beeinflussen
import { GenericContainer, StartedTestContainer } from 'testcontainers';

export class TestDatabaseContainer {
  private container: StartedTestContainer | null = null;

  // started den container und gibt die connection string zurück
  async start(): Promise<string> {
    this.container = await new GenericContainer('postgres:15')
      .withEnvironment('POSTGRES_USER', 'testuser')
      .withEnvironment('POSTGRES_PASSWORD', 'testpass')
      .withEnvironment('POSTGRES_DB', 'testdb')
      .withExposedPorts(5432)
      .start();

    // Gibt die connection string zurück, damit die tests sich mit der test database verbinden können
    const host = this.container.getHost();
    const port = this.container.getMappedPort(5432);
    return `postgresql://testuser:testpass@${host}:${port}/testdb`;
  }

  // Räumt auf nach den Tests
  async stop(): Promise<void> {
    if (this.container) {
      await this.container.stop();
    }
  }
}