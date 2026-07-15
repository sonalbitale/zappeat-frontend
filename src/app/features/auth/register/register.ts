import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth.service';
import { email } from '@angular/forms/signals';
import { routes } from '../../../app.routes';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {


  registerform : FormGroup ;



  constructor(
    private fb : FormBuilder,
    private authservice : Auth,
    private router : Router
){
  // form creation
  this.registerform = this.fb.group({
  username: ['', Validators.required],
  password:['',Validators.required],
  email:['',Validators.required]
 })
}

// method to call on registeration form submission

onSubmit(){

  debugger
  if(this.registerform?.invalid) return

  const payload = this.registerform?.value;

  this.authservice.register(payload).subscribe({
    next :(res:any) => {
      debugger
    console.log("user registred succesfully");
    this.router.navigate(['/login']);

    },
    error:(err)=>{
      console.log("user creation failed")
    }

  })
}

}
