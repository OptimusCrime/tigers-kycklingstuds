import { Tombstone } from './tombstone';

export class Tombstones {
  private tombstones: Tombstone[];

  constructor() {
    this.tombstones = [];
  }

  public add(): void {
    this.tombstones.push(new Tombstone());
  }

  public get(): Tombstone[] {
    return this.tombstones;
  }

  public tick(delta: number): void {
    this.tombstones = this.tombstones.map((kyckling) => kyckling.tick(delta));
  }
}
