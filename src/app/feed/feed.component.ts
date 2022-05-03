import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
UpdatedProfileURL='http://localhost:8080/api/user/'
FeedGetURL='http://localhost:8080/api/feed';
FeedPostURL='http://localhost:8080/api/feed';
feedArr:any=[]
currentUser:any=[];
show:any=false  
token:any=[];
arr1:any=[];
comment=false;
flag=true
username:any
@ViewChild('f') data!: NgForm;
@ViewChild('frm') frm!: NgForm;
name = 'Angular';
img!: File;
your_new_name = '';
your_comment='';
allUser:any=[];
contentLoaded=false;

listArray : string[] = [];
sum = 5;
direction = "";


  constructor(private router:Router,private http:HttpClient,private toastr:ToastrService) { }

  ngOnInit(): void {
    if(localStorage.getItem('currentUser')){
      this.currentUser=JSON.parse(localStorage.getItem('currentUser')!)
      console.log(this.currentUser._id);
      
    }
    if (localStorage.getItem('token')) {
      this.token = JSON.parse(localStorage.getItem('token')!)
      console.log(this.token);

    }
    this.http.get<any>(this.UpdatedProfileURL,{ headers: { "auth-token": this.token }}).subscribe((data:any)=>{
      this.allUser=data.users;
      console.log(this.allUser);
      
      
    })

this.http.get<any>(this.UpdatedProfileURL+this.currentUser._id,{ headers: { "auth-token": this.token }}).subscribe((data:any)=>{
  console.log(data.users);
  this.username=data.users.firstName+" "+data.users.lastName;
  
})
// this.http.get<any>(this.FeedGetURL,{ headers: { "auth-token": this.token }}).subscribe((res:any)=>{
//   this.feedArr=res;
//   console.log(this.feedArr.feeds);
// })

this.http.get<any>('http://localhost:8080/api/feed?page=1&size=3000',{ headers: { "auth-token": this.token }}).subscribe((res:any)=>{
 console.log(res);
 this.feedArr=res;
   console.log(this.feedArr.feeds);
})

setTimeout(() => {
  this.contentLoaded = true;
}, 5000);

this.appendItems();
  }
  addComment(){
    this.comment=true;
  }


  onFileChanged(event:any) {
    this.img = event.target.files[0];
    const formData=new FormData();
    formData.append("photo", event.target.files[0]);
    this.http.post<any>('http://localhost:8080/api/feed/upload',formData).subscribe((res:any)=>{
  console.log(res.message.path);
  this.img=res.message.path
  
  });
}

  onSubmit() {
   
    this .http.post<any>(this.FeedPostURL,{photo:this.img,caption:this.data.value.caption},{ headers: { "auth-token": this.token }}).subscribe((data:any)=>{
      console.log(data);
      
    })

    this.http.get<any>(this.FeedGetURL,{ headers: { "auth-token": this.token }}).subscribe((res:any)=>{
      this.feedArr=res;
      console.log(this.feedArr.feeds);
      this.ngOnInit()

    })

    this.toastr.success("Post Added successfully !!", "Success")
    window.location.reload()
 
  }
  onLike(fa:any){
  let arr=[]
 
  let val=0
    console.log(fa._id);
    arr=fa.like;
  for(let i=0;i<arr.length;i++){
  if(arr[i].userId==this.currentUser._id){
  
    this.flag=false
    val=i
    break
  }
}
(this.flag)?arr.push({userId:this.currentUser._id}):arr.splice(val,1);
(this.flag)?this.flag=false:this.flag=true

  
    fa.like=arr;

    this .http.put<any>(this.FeedPostURL+"/"+fa._id,fa,{ headers: { "auth-token": this.token }}).subscribe((data:any)=>{
      console.log(data);
      
    })
  }
  onComment(fa:any){
    let arr=[] 
    let val=0
      console.log(fa._id);
      arr=fa.comment;
      arr.push({userId:this.currentUser._id,comment:this.frm.value.your_comment,date:Date.now()})
      fa.comment= arr;
      this .http.put<any>(this.FeedPostURL+"/"+fa._id,fa,{ headers: { "auth-token": this.token }}).subscribe((data:any)=>{
        console.log(data);
        
      })
      this.frm.reset()

  }
  onScrollDown(ev: any) {
    console.log("scrolled down!!", ev);

    this.sum += 20;
    this.appendItems();
    
    this.direction = "scroll down";
  }

  // onScrollUp(ev: any) {
  //   console.log("scrolled up!", ev);
  //   this.sum += 20;
  //   this.prependItems();

  //   this.direction = "scroll up";
  // }

  appendItems() {
    this.addItems("push");
  }

  prependItems() {
    this.addItems("unshift");
  }

  addItems(_method: string) {
    for (let i = 0; i < this.sum; ++i) {
      if( _method === 'push'){
        this.listArray.push([i].join(""));
      }else if( _method === 'unshift'){
        this.listArray.unshift([i].join(""));
      }
    }
  }
}