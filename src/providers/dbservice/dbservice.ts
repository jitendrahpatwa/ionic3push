import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DbserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

declare var window : any;
declare var sqlitePlugin : any;

@Injectable()
export class DbserviceProvider {

  public db = null;
  public arr = [];

  constructor(
    public http: Http,
    private sqlite: SQLite
  ) {
    console.log('Hello DbserviceProvider Provider');
  }

  dbinit(){
    console.log("1");
    this.sqlite.create({
      name: 'dbdemovertwo.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
     
    
        db.executeSql('create table danceMoves(name VARCHAR(32))', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
    
    
      })
      .catch(e => console.log(e));
      console.log("2");
  }

  insertIN(){
    // const db = new SQLiteObject;
    // .executeSql('',{});
  }

  openDb() {
    this.db = window
      .sqlitePlugin
      .openDB({name: 'todo.db', location: 'default'});
    this
      .db
      .transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Todo (id integer primary key,todoItem text)');
      }, (e) => {
        console.log('Transtion Error', e);
      }, () => {
        console.log('Populated Datebase OK..');
      })
  }

  addItem(i) {
    return new Promise(resolve => {
      var InsertQuery = "INSERT INTO Todo (todoItem) VALUES (?)";
      this
        .db
        .executeSql(InsertQuery, [i], (r) => {
          console.log('Inserted... Sucess..', i);
          this.db
            .getRows()
            .then(s => {
              resolve(true)
            });
        }, e => {
          console.log('Inserted Error', e);
          resolve(false);
        })
    })
  }

  getRows() {
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM Todo";
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arr
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })

  }
  
}
