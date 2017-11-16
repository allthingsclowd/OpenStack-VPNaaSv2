import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  // serverChange(){
  //   let token = this.currentScopedToken;
  //   let serverId = this.passwordForm.get('serverData.server').value;
  //   //console.log('Server Password Prerequisites');
  //   //console.log(token);
  //   //console.log(serverId);
  //   this.passwordReceived = false;
  //   this.computeService.getServerPassword(token, serverId)
  //         .subscribe( serverPassword => {
  //           this.passwordReceived = true;
  //           //console.log('Encrypted Password is');
  //           //console.log(serverPassword);
  //           this.encryptedPassword = serverPassword;
            
  //         });
       
  // }



  // onThisButton() {
  //     //console.log('Decoding Key now')
  //     //console.log(this.passwordForm.get('serverData').value);
  //     //console.log(this.passwordManagementService.decrypt_data(this.passwordForm.get('serverData.pemkey').value,this.encryptedPassword));  
  //   //this.passwordForm.reset();
  // }
}
