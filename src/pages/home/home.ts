import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DbserviceProvider } from '../../providers/dbservice/dbservice';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  chkObserver:any;
  chklist:any= []; 
  itemtxt:string;

  constructor(
    public navCtrl: NavController,
    public dbserv:DbserviceProvider
  ) {
    //let d = this.dbserv.openDb();
    this.callob();
  }

  callob(){
    this.chklist = Observable.create(ob=>{
      this.chkObserver = ob;
      console.log(ob);
    })
  }
 
  push(){
    (this.chklist)=(this.itemtxt);
    console.log(this.itemtxt);
    //this.chkObserver.next(true);
  }

  checklistUpdates(): Observable<any> {
    return this.chklist;
  }

}
