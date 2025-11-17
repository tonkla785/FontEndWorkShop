import { Injectable } from '@angular/core';
import { User } from '../interface/userinterface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];

  constructor() {}

  getUsers(): User[] {
    return [...this.users];
  }

  addUser(user: User): void {
    const lastId =
      this.users.length > 0 ? this.users[this.users.length - 1].id : 0;
    user.id = lastId + 1;
    user.update = new Date();
    this.users = [...this.users, user];
  }

  updateUser(id: number, updatedUser: User): void {
    this.users = this.users.map((u) =>
      u.id === id ? { ...u, ...updatedUser} : u
    );
  }

  deleteUser(id: number): void {
    this.users = this.users.filter((u) => u.id !== id);
  }

  calculateAge(birthDate: Date): number {
    if (!birthDate) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && d < 0)) age--;
    return age > 0 ? age : 0;
  }
}
