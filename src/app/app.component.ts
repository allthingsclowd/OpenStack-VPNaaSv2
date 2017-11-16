import { ComputeService } from './services/compute.service';
import { projects, project } from './model/user';
import { IdentityService } from './services/identity.service';
import { PasswordManagementService } from './services/password-management.service';
import { Component, OnInit, OnChanges } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loggedIn: boolean = false;
  userProjects: project[] = null;
  currentProject: project = null;
  contractProjects: any = null;


  constructor(private identityService: IdentityService) {}


  ngOnInit() {
    this.identityService.loggedIn.subscribe(status => this.loggedIn = status);
    this.identityService.userProjects.subscribe(currentProjects => this.userProjects = currentProjects);
    this.identityService.currentProject.subscribe(selectedProject => this.currentProject = selectedProject);
    this.identityService.contractProjects.subscribe(projects => this.contractProjects = projects);

  }


  
 
}
