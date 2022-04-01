import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-music-home',
  templateUrl: './music-home.component.html',
  styleUrls: ['./music-home.component.scss']
})
export class MusicHomeComponent implements OnInit {



  constructor(private spotifyApiService:SpotifyApiService) { }

  ngOnInit(): void {
    this.spotifyApiService.login()


  }

}
