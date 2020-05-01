import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../../_models/user';;
import { Router } from '@angular/router';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-register1',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent1 implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  @Output() registerSuccess = new EventEmitter();
  user: User;
  isFormReset: boolean = false;

  registerForm: FormGroup;
  countryList: Array<any>;
  response: any;
  registrationMessage = '';
  // bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    // this.bsConfig = {
    //   containerClass: 'theme-red'
    // };
    this.createRegisterForm();
    this.GetCountryList();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        (res) => {
          this.response = res;
          if (this.response.status === 'Success') {
            this.cancel(this.response.message);
          } else {
            this.registrationMessage = this.response.message;
          }
        },
        (error) => {
          this.router.navigate(['/home']);
          this.registerSuccess.emit(false);
        }
      );
    }
  }

  GetCountryList() {
    // this.countryList = [
    //   { name: 'India', cities: ['Mumbai'] },
    //   {
    //     name: 'Germany',
    //     cities: ['Duesseldorf', 'Leinfelden-Echterdingen', 'Eschborn'],
    //   },
    //   { name: 'Spain', cities: ['Barcelona'] },
    //   { name: 'USA', cities: ['Downers Grove'] },
    //   { name: 'Mexico', cities: ['Puebla'] },
    //   { name: 'China', cities: ['Beijing'] },
    // ];

    this.authService.getCountryList().subscribe(
      (next) => {
        this.countryList = next;
      },
      (error) => {
        // this.alertify.error(error);
      }
    );
  }

  cancel(msg: any) {
    this.cancelRegister.emit(msg);
  }

  resetForm() {
    this.registerForm.reset();
    this.isFormReset = true;
  }
}
