import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { DbserviceProvider } from '../providers/dbservice/dbservice';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public dbserv:DbserviceProvider,
    private push: Push,
    public http:Http
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

    let db = this.dbserv.dbinit();
    console.info(db);

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.initPush();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initPush(){
    // to initialize push notifications
    //this.testsendToApi("registration","type");
    const options: PushOptions = {
       android: {
        senderID: '904286916278'
       },
       ios: {
           alert: 'true',
           badge: true,
           sound: 'false'
       },
       windows: {},
       browser: {
           pushServiceURL: 'http://push.api.phonegap.com/v1/push'
       }
    };

    const pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration)
      console.log('Device registreid', registration.registrationId)
      let regid = localStorage.getItem("regid");
      if(regid == "" || regid == null || regid == "null" || regid == "undefined" || regid == undefined || !regid){
        this.sendToApi(registration,"stored firsttime");
        localStorage.setItem("regid",registration.registrationId);
      }else{
        if(regid == registration.registrationId){
          alert("Regid not changed \n"+regid);
        }else{
          this.sendToApi(registration,"restored");
          localStorage.setItem("regid",registration.registrationId);
        }
      }
      
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  sendToApi(registration,type){
    //return new Promise((resolve,reject)=>{
      this.http.post("https://myoptionalwebsite.000webhostapp.com/php/savetoken.php",JSON.stringify({
        "type":"pusherv3",
        "utoken":"registration.registrationId",
        "active":0
      })
      )
      .map(res=>res.json())
      .subscribe(
          d=>{
              alert(type+":\n"+registration.registrationId+"\n\n"+JSON.stringify(registration)+"\n\n"+JSON.stringify(d));
              //resolve({status:'ok',data:d});
          },
          e=>{
              alert("failed"+":\n"+registration.registrationId+"\n\n"+JSON.stringify(registration)+"\n\n"+JSON.stringify(e.message));
              //reject({status:'fail',data:e});
          }
      );
    //})
  }

  testsendToApi(registration,type){
    //return new Promise((resolve,reject)=>{
      this.http.post("https://myoptionalwebsite.000webhostapp.com/php/savetoken.php",JSON.stringify({
        "type":"pusherv3",
        "utoken":"registration.registrationId",
        "active":0
      })
      )
      .map(res=>res.json())
      .subscribe(
          d=>{
              alert(JSON.stringify(d));
          },
          e=>{
              alert(JSON.stringify(e.message));
          }
      );
    //})
  }
}
