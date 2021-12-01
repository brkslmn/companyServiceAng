import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {DynamicFlatNode} from '@/components/sftp-server-dialog/DynamicFlatNode';

@Injectable({
  providedIn: 'root'
})
export class SftpService {

  constructor(private apiService: ApiService) { }

  dirs: string[];
  files: string[];
  childrendir: string[];
  childrenfile: string[];
  childs: string[];

  async initialData() {
    return new Promise<DynamicFlatNode[]>((resolve, reject) => {
      try{
        this.apiService.getSftpFiles(".").subscribe((res)=>{
          this.dirs =  (<any>res).dirs; 
          this.files = (<any>res).files;
          const files = this.files.map(name => new DynamicFlatNode(name, 0, false));
          const dirs = this.dirs.map(name => new DynamicFlatNode(name, 0, true));
          resolve(dirs.concat(files));
        }) 
      } catch(error){
        reject(error);
      }
    })
  }

  async getChildren(node: string) {
    return new Promise<string[]>((resolve, reject) => {
      try{
        this.apiService.getSftpFiles(node).subscribe((res)=>{
          this.childrendir =  (<any>res).dirs;
          this.childrenfile = (<any>res).files;  
          resolve(this.childrendir.concat(this.childrenfile));
        })
      }catch(error){
        reject(error);
      }
    })
  }

  isExpandable(node: string): boolean {
    if(this.dirs.includes(node) || this.childrendir.includes(node)){
      return true;

    }else{
      return false;
    }
   
  }
}

