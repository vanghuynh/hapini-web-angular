import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AddressService } from '@app/core/services/address.service';
import { HouseService } from '@app/core/services/house.service';
import { IContact } from '@app/model/interfaces';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { AuthenticationService } from "@app/core/authentication/authentication.service";
import { ContactService } from '@app/core/services/contact.service';
@Component({
  selector: 'house-contact',
  templateUrl: './house-contact.component.html',
  styleUrls: ['./house-contact.component.scss']
})
export class HouseContactComponent implements OnInit {

  contact: IContact;
  contactId: number;

  constructor(private houseService: HouseService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private addressService: AddressService,
    private contactService: ContactService) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      console.log("params: ", params);
      const contactId = +params['contactId'];
      this.contactId = contactId;
      this.getContact(this.contactId);
    });
    
  }

  private getContact(contactId:number){
    if (contactId && contactId != 0) {
      this.contactService.getContactById(contactId)
      .pipe(finalize(() => {  }))
      .subscribe(contact => {
        this.contact = contact;
        console.log("Contact: ", this.contact);
      }, err =>{
        console.log("Error getting contact", err);
      });
    }
  }

}
