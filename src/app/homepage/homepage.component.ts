import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User, UserFormError } from '../interface/userinterface';
import { UserService } from '../service/userservice';
import Swal from 'sweetalert2';

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

  users: User[] = [];
  errorMessage: string = '';
  error: UserFormError = {
    firstNameError: '',
    lastNameError: '',
    birthDateError: '',
    genderError: '',
  };

  showForm = false;
  isEditMode = false;
  editingUserId: number | null = null;
  userIdToDelete: number | null = null;

  date: Date = new Date();
  fullName = '';
  id = 0;
  firstName = '';
  lastName = '';
  birthDate: Date | undefined = undefined;
  age = 0;
  gender = '';
  updateDate: Date | undefined = undefined;
  searchBirthDate: Date | undefined = undefined;

  constructor(private userService: UserService) {
    this.minDate = undefined;
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.fetchUsers();
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  fetchUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('โหลดข้อมูลสำเร็จ', data);
      },
      error: (err) => {
        console.error('โหลดข้อมูลไม่สำเร็จ', err);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลได้';
      },
    });
  }

  searchUsers() {
    if (this.fullName.trim() !== '') {
      this.splitFullName();
    }

    const userToSearch: User = {
      id: this.id,
      firstname: this.firstName,
      lastname: this.lastName,
      birthday: this.searchBirthDate
        ? this.formatDate(this.searchBirthDate)
        : undefined,
      age: this.age,
      gender: this.gender,
      updateDate: this.updateDate
        ? this.formatDate(this.updateDate)
        : undefined,
    };

    this.userService.getUserByField(userToSearch).subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.alertMessage();
        if (data.length === 0) {
          console.log('ไม่พบข้อมูลผู้ใช้');
          this.alertErrorMessage();
        } else {
          console.log('ค้นหาผู้ใช้สำเร็จ');
        }
      },
      error: (err) => {
        console.error('Error searching users', err);
        this.errorMessage = 'เกิดข้อผิดพลาดในการค้นหา';
      },
    });
  }

  openAddUserModal() {
    this.isEditMode = false;
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
    this.birthDate = user.birthday ? new Date(user.birthday) : undefined;
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
      birthday: this.birthDate ? this.formatDate(this.birthDate) : undefined,
      age: this.age,
      gender: this.gender,
      updateDate: this.updateDate
        ? this.formatDate(this.updateDate)
        : undefined,
    };

    if (this.isEditMode && this.editingUserId !== null) {
      this.userService.updateUser(this.editingUserId, userData).subscribe({
        next: (res) => {
          console.log('User updated', res);
          this.fetchUsers();
          this.userService.notifyUsersChanged();
        },
        error: (err) => console.error(err),
      });
    } else {
      this.userService.addUser(userData).subscribe({
        next: (res) => {
          console.log('User created', res);
          this.fetchUsers();
          this.userService.notifyUsersChanged();
        },
        error: (err) => console.error(err),
      });
    }

    this.userModal.hide();
    this.resetForm();
    this.alertMessage();
  }

  confirmDeleteUser() {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          console.log('User deleted');
          this.fetchUsers();
          this.userService.notifyUsersChanged();
        },
      });
    } else {
      console.error('No user ID to delete');
    }
    this.deleteModal.hide();
    this.alertMessage();
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
    this.id = 0;
    this.fullName = '';
    this.firstName = '';
    this.lastName = '';
    this.birthDate = undefined;
    this.age = 0;
    this.gender = '';
    this.updateDate = undefined;
    this.searchBirthDate = undefined;
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

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
  }

  splitFullName() {
    if (!this.fullName || this.fullName.trim() === '') {
      this.firstName = '';
      this.lastName = '';
      return;
    }

    const parts = this.fullName.trim().split(' ');

    this.firstName = parts[0];
    this.lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
  }

  alertMessage() {
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      title: 'Successful!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '400px',
      padding: '10px',

      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  alertErrorMessage() {
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'error',
      text: 'ไม่พบข้อมูลผู้ใช้',
      title: 'Error!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '400px',
      padding: '10px',

      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }
}
