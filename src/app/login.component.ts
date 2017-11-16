import { UtilityService } from './services/utility.service';
import { ComputeService } from './services/compute.service';
import { IdentityService } from './services/identity.service';
import { PasswordManagementService } from './services/password-management.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  regions = ['uk-1', 'fi-1', 'de-1', 'es-1', 'us-1'];
  loginForm: FormGroup;
  loggedIn: boolean = false;
  failedLogIn: boolean = false;
  k5proxy:boolean = true;



  constructor(private identityService: IdentityService,
              private utilityService: UtilityService) { }

  ngOnInit() {
    this.identityService.loggedIn.subscribe(status => this.loggedIn = status);
    this.utilityService.userK5CORS.subscribe(proxy => this.k5proxy = proxy);

    this.loginForm = new FormGroup({
      'loginData': new FormGroup({
        'user': new FormControl(null, [Validators.required]),
        'password': new FormControl(null, [Validators.required]),
        'contract': new FormControl(null, [Validators.required]),
        'region': new FormControl(null, [Validators.required]),
        'k5cors': new FormControl(true)
      })
    });
  }

  toggleK5Proxy() {
    //console.log(this.k5proxy);
    this.utilityService.changek5proxy(this.k5proxy);
    //console.log(this.k5proxy);
  }


  onLogin() {
    this.identityService.login( this.loginForm.get('loginData.user').value,
                                                this.loginForm.get('loginData.password').value,
                                                this.loginForm.get('loginData.contract').value,
                                                this.loginForm.get('loginData.region').value)
                                                .subscribe(
                                                    data => {
                                                        //this.identityService.loggedIn = true;
                                                        //this.failedLogIn = false;
                                                        //console.log("Login.ts -> Logged In");
                                                        // this.identityService.getProjectList().subscribe(newProjectList => {
                                                        //   this.projects = newProjectList;
                                                        // });
                                                        // this.identityService.getK5UnScopedDetails();

                                                    },
                                                    error => {
                                                        //this.alertService.error(error);
                                                        //this.loading = false;
                                                        //console.log('bang - something failed during login');
                                                        //this.failedLogIn = true;
                                                        this.loginForm.reset();
                                                        
                                                    });
    //console.log(this.loginForm);
    //this.passwordForm.reset();
  }

 
}
