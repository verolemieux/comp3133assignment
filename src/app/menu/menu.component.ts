import { Component, OnInit, ViewChild } from '@angular/core';
import io from "socket.io-client";
import { ApiService } from '../service/api.service';
import { History } from '../../model/history';
import { Event } from '../../model/event';
import { Game } from '../../model/game';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [ApiService]
})
export class MenuComponent implements OnInit {
  numPlayers: number;
  joinable: boolean;
  msg: string;
  private socket: any;

  historyColumns: string[] = ['player', 'opponent', 'date', 'time', 'message'];
  historyEntries: History[];
  historyDataSource: MatTableDataSource<History>;
  showHistory: boolean;
  @ViewChild('historyPaginator', {static: true}) historyPaginator: MatPaginator;

  eventColumns: string[] = ['type', 'date', 'time', 'user'];
  eventLogs: Event[];
  eventDataSource: MatTableDataSource<Event>;
  showEvents: boolean;
  @ViewChild('eventPaginator', {read: MatPaginator, static: true}) eventPaginator: MatPaginator;

  gameColumns: string[] = ['player1', 'player2', 'winner', 'scorePlayer1', 'scorePlayer2'];
  gameEntries: Game[];
  gameDataSource: MatTableDataSource<Game>;
  showGames: boolean;
  @ViewChild('gamePaginator', {static: true}) gamePaginator: MatPaginator;

  showDashboard: boolean;

  constructor(private apiService: ApiService,  private router: Router,) { }

  ngOnInit() {
    this.showDashboard = true;
    this.socket = io("http://localhost:3000");
    this.socket.emit("checkNumPlayers")
  }

  ngAfterViewInit(){

    this.socket.on('numplayers', data =>{
      console.log('pulling')
      this.numPlayers = data
      if(this.numPlayers >= 2){
        this.joinable = false
        this.msg = "No game available!"
      }
      else{
        this.joinable = true
        this.msg = ""
      }
    })

  }

  openDashboard(){
    this.showDashboard = true;
    this.showHistory = false;
    this.showEvents = false;
    this.showGames = false;
  }

  getChatHistory() {
    this.showHistory = true;
    this.showEvents = false;
    this.showDashboard = false;
    this.showGames = false;
    this.apiService
    .getHistory()
    .then((historyEntries: History[]) => {
      this.historyEntries = historyEntries.map((historyEntry) => {
        return historyEntry;
      })
      this.historyDataSource = new MatTableDataSource(historyEntries);
      this.historyDataSource.paginator = this.historyPaginator;
    })
    return this.historyEntries;
  }

  playGame(){
    console.log(this.numPlayers)
    if(this.numPlayers >= 2){
      this.router.navigate([''])
    }
    else{
      this.router.navigate(['/playgame'])
    }
  }

  getEventLog() {
    this.showHistory = false;
    this.showEvents = true;
    this.showDashboard = false;
    this.showGames = false;
    this.apiService
    .getEventLog()
    .then((eventLogs: Event[]) => {
      this.eventLogs = eventLogs.map((eventLog) => {
        return eventLog;
      })
      this.eventDataSource = new MatTableDataSource(eventLogs);
      this.eventDataSource.paginator = this.eventPaginator;
    })
    return this.eventLogs;
  }

  getGameHistory() {
    this.showHistory = false;
    this.showEvents = false;
    this.showDashboard = false;
    this.showGames = true;
    this.apiService
    .getGameHistory()
    .then((gameEntries: Game[]) => {
      this.gameEntries = gameEntries.map((gameEntry) => {
        return gameEntry;
      })
      this.gameDataSource = new MatTableDataSource(gameEntries);
      this.gameDataSource.paginator = this.gamePaginator;
    })
    return this.gameEntries;
  }
}
