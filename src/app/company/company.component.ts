import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  HostBinding
} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { ApiService } from '@services/api.service';
import { HttpRequest, HttpHeaders, HttpClient } from '@angular/common/http';
import { Company } from './company';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  constructor(private apiService: ApiService, private http:HttpClient, private formbuilder:FormBuilder) { }
  company: any;
  companies: Observable<Company[]>;
  CompanyForm: any; 
  dataSaved = false;
  companyIdUpdate = null;
  message = null;


  ngOnInit(): void {
    this.CompanyForm = this.formbuilder.group({
      CompanyName: ['', [Validators.required]],  
      WorkField: ['', [Validators.required]],  
      PhoneNumber: ['', [Validators.required]],  
      Adress: ['', [Validators.required]],
    })
    
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.companies = this.apiService.getCompanyList();
  }
  
  onFormSubmit() {  
    this.dataSaved = false;  
    const company = this.CompanyForm.value;  
    this.CreateCompany(company);  
    this.CompanyForm.reset();  
  }

  CreateCompany(company: Company) {  
    if (this.companyIdUpdate == null) {  
      this.apiService.CreateCompany(company).subscribe(  
        () => {  
          this.dataSaved = true;  
          this.message = 'Record saved Successfully';  
          this.getAllCompanies();  
          this.companyIdUpdate = null;  
          this.CompanyForm.reset();  
        }  
      );  
    } else {  
      company.Id = this.companyIdUpdate;  
      this.apiService.UpdateCompany(company).subscribe(() => {  
        this.dataSaved = true;  
        this.message = 'Record Updated Successfully';  
        this.getAllCompanies();  
        this.companyIdUpdate = null;  
        this.CompanyForm.reset();  
      });  
    }  
  }

  DeleteCompany(companyId: string) {  
    if (confirm("Are you sure you want to delete this ?")) {   
    this.apiService.DeleteCompany(companyId).subscribe(() => {  
      this.dataSaved = true;  
      this.message = 'Record Deleted Succefully';  
      this.getAllCompanies();  
      this.companyIdUpdate = null;  
      this.CompanyForm.reset();  
    });}  
  }
  resetForm() {  
    this.CompanyForm.reset();  
    this.message = null;  
    this.dataSaved = false;  
  }  
}  

