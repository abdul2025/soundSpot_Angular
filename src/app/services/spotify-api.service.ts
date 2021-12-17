import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {environment} from "../../environments/environment"


export interface AuthRespData{
    access_token: string,
    token_type: string,
    expiresIn: number,

}
@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {


  constructor(
    private http: HttpClient,
    // private router: Router,
    ){}


  private spotifyCalls(data){
    const accessAPi = 'https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl'
    const token = data.token_type +" "+ data.access_token
    const httpOpti = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    }
    this.http.get(accessAPi, httpOpti).subscribe(data=>{
      console.log(data)
    })
  }



  login(){
    const client_id = environment.client_id
    const client_secret = environment.client_secret
    let authorizationData = 'Basic ' + btoa(client_id + ':' + client_secret);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': authorizationData
      })
    }
    const body = new HttpParams()
    .set('grant_type', 'client_credentials');
    const url = 'https://accounts.spotify.com/api/token?'
    return this.http.post<AuthRespData>(url, body, httpOptions).subscribe(data => {
      console.log(data)
      this.spotifyCalls(data)
    })

  }

}
