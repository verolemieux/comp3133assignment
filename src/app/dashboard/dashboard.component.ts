import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { User } from '../../model/user';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ApiService]
})
export class DashboardComponent implements OnInit {
  topScoresColumns: string[] = ['player', 'score'];
  topScores: User[];
  topScoresDataSource: MatTableDataSource<User>;

  topUsersColumns: string[] = ['player', 'numWins'];
  topUsers: User[];
  topUsersDataSource: MatTableDataSource<User>;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getTop();
  }

  getTop(){
    this.apiService
    .getTopScores()
    .then((users: User[]) => {
      this.topScores = users.map((user) => {
        return user;
      })
      this.topScoresDataSource = new MatTableDataSource(this.topScores);
    })
    
    this.apiService
    .getTopUsers()
    .then((users: User[]) => {
      this.topUsers = users.map((user) => {
        return user;
      })
      this.topUsersDataSource = new MatTableDataSource(this.topUsers);
    })

  }
}
