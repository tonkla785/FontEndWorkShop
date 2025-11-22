import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User, UserFormError } from '../interface/userinterface';
import { UserService } from '../service/userservice';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  @ViewChild('exampleModal') userModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  minDate?: Date;
  maxDate: Date;

  user: User[] = [];
  error: UserFormError = {
    firstNameError: '',
    lastNameError: '',
    birthDateError: '',
    genderError: '',
  };

  isEditMode = false;
  editingUserId: number | null = null;
  userIdToDelete: number | null = null;

  date: Date = new Date();
  firstName = '';
  lastName = '';
  birthDate: Date | undefined = undefined;
  age = 0;
  gender = '';

  constructor(private userService: UserService) {
    this.minDate = undefined;
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.user = this.userService.getUsers();
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  openAddUserModal() {
    this.isEditMode = false;
    this.editingUserId = null;
    this.resetForm();
    this.userModal.show();
  }

  openDeleteModal(userId: number) {
    this.userIdToDelete = userId;
    this.deleteModal.show();
  }

  openEditUserModal(user: User) {
    this.isEditMode = true;
    this.editingUserId = user.id;

    this.firstName = user.firstname;
    this.lastName = user.lastname;
    this.birthDate = user.birddate ? new Date(user.birddate) : undefined;
    this.age = user.age;
    this.gender = user.gender;

    this.resetErrors();
    this.userModal.show();
  }

  saveUser() {
    if (!this.validateUser()) return;

    const userData: User = {
      id: this.editingUserId ?? 0, //null check
      firstname: this.firstName,
      lastname: this.lastName,
      birddate: this.birthDate,
      age: this.age,
      gender: this.gender,
      update: new Date(),
    };

    if (this.isEditMode && this.editingUserId !== null) {
      this.userService.updateUser(this.editingUserId, userData);
      console.log('User updated');
    } else {
      this.userService.addUser(userData);
      console.log('User created');
    }

    this.user = this.userService.getUsers();
    this.userModal.hide();
    this.resetForm();
  }

  confirmDeleteUser() {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete);
      this.user = this.userService.getUsers();
      this.userIdToDelete = null;
      this.deleteModal.hide();
      console.log('User deleted');
    }
  }

  validateUser(): boolean {
    this.resetErrors();

    if (!this.firstName.trim()) this.error.firstNameError = 'กรุณากรอกชื่อ';
    if (!this.lastName.trim()) this.error.lastNameError = 'กรุณากรอกนามสกุล';
    if (!this.birthDate)
      this.error.birthDateError = 'กรุณากรอกวันเกิดให้ถูกต้อง';
    if (!this.gender) this.error.genderError = 'กรุณาเลือกเพศ';

    return !Object.values(this.error).some((e) => e !== '');
  }

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.birthDate = undefined;
    this.age = 0;
    this.gender = '';
    this.resetErrors();
  }

  resetErrors() {
    this.error = {
      firstNameError: '',
      lastNameError: '',
      birthDateError: '',
      genderError: '',
    };
  }

  onBirthDateChange(date: Date | undefined) {
    this.error.birthDateError = '';
    if (date) {
      this.birthDate = date;
      this.age = this.userService.calculateAge(date);
    } else {
      this.birthDate = undefined;
      this.age = 0;
    }
  }
}
