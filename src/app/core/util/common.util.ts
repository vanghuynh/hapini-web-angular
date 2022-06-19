import { IRoom, IHouse } from "@app/model/interfaces";
import { NgxGalleryImage } from "ngx-gallery";
import { formatDate } from "@angular/common";
import { FormGroup } from '@angular/forms';
/**
 * Update house list
 */
export function updateHouses(houses: IHouse[]){
    if(houses){
        var numAvailable = 0;
        houses.forEach(e => {
            if(e.rooms && e.rooms.length > 0){
                e.available = e.rooms.filter(room => room.available == true && room.status == 'APPROVE').length;
                let start = e.rooms.length;
                e.minPrice = e.rooms
                                    //.filter(room => room.available == true && room.status == 'APPROVE')
                                    .reduce((min, n)=> Math.min(min, n.price), e.rooms[0].price);
                let lastUpdate: Date = e.rooms.reduce((min, n)=> (min < n.lastUpdate ? min : n.lastUpdate), e.rooms[0].lastUpdate);
                e.lastUpdate = lastUpdate;
            } else {
                e.available = 0;
                e.minPrice = 0;
            }

            if(!e.images || e.images.length == 0){
                e.avatar = 'assets/hapinistay-logo-border-white.png';
                e.imageUrls = ['assets/hapinistay-logo-border-white.png'];
            } else {
                e.avatar = e.images[0].secure_url;
                var images: string[] = [];
                e.imageUrls = e.images.map(e => e.secure_url);
            }
            if(e.address){
                e.displayAddress = 
                (e.address.streetNumber ? e.address.streetNumber : '') + ', '
                + (e.address.streetName ? e.address.streetName : '') + ', '
                + (e.address.wardName ? e.address.wardName : '') + ', '
                + (e.address.districtName ? e.address.districtName : '') + ', '
                + (e.address.cityName ? e.address.cityName : '');
            }
        });
    }
}

/**
 * Update house
 */
export function updateHouse(house: IHouse){
    if(house){
        if(house.rooms && house.rooms.length > 0){
            house.available = house.rooms.filter(room => room.available == true && room.status == 'APPROVE').length;
            let start = house.rooms.length;
            house.minPrice = house.rooms
                                        //.filter(room => room.available == true && room.status == 'APPROVE')
                                        .reduce((min, n)=> Math.min(min, n.price), house.rooms[0].price);
        } else {
            house.available = 0;
            house.minPrice = 0;
        }

        if(!house.images || house.images.length == 0){
            house.avatar = 'assets/hapinistay-logo-border-white.png';
            house.imageUrls = ['assets/hapinistay-logo-border-white.png'];
        } else {
            house.avatar = house.images[0].secure_url;
            var images: string[] = [];
            house.imageUrls = house.images.map(e => e.secure_url);
        }
        //update room images
        if(!house.rooms || house.rooms.length > 0){
            house.rooms.forEach(room => {
                if(!room.images || room.images.length == 0){
                    room.avatar = 'assets/hapinistay-logo-border-white.png';
                    room.imageUrls = ['assets/hapinistay-logo-border-white.png'];
                } else {
                    room.avatar = room.images[0].secure_url;
                    room.imageUrls = room.images.map(room => room.secure_url);
                }
            });
        }
        if(house.address){
            house.displayAddress = 
            (house.address.streetNumber ? house.address.streetNumber : '') + ', '
            + (house.address.streetName ? house.address.streetName : '') + ', '
            + (house.address.wardName ? house.address.wardName : '') + ', '
            + (house.address.districtName ? house.address.districtName : '') + ', '
            + (house.address.cityName ? house.address.cityName : '');
        }
    }
}

/**
 * Get house's images
 */
export function getHouseImages(house: IHouse): NgxGalleryImage[]{
    var images: NgxGalleryImage[] = [];
    if(house){
        if(!house.images || house.images.length == 0){
            images = [];
        } else {
            images = house.images.map(e =>  {
                let image : NgxGalleryImage = {
                    small: e.secure_url,
                medium: e.secure_url,
                big: e.secure_url
                }
                return image;
            });
        }
    }
    return images;
}


/**
 * Update house list
 */
export function updateRooms(rooms: IRoom[]){
    if(rooms){
        rooms.forEach(room => {
            if(!room.images || room.images.length == 0){
                room.avatar = 'assets/hapinistay-logo-border-white.png';
                room.imageUrls = ['assets/hapinistay-logo-border-white.png'];
            } else {
                room.avatar = room.images[0].secure_url;
                var images: string[] = [];
                room.imageUrls = room.images.map(e => e.secure_url);
            }
        });
    }
}

/**
 * Update room
 */
export function updateRoom(room: IRoom){
    if(room){
        if(!room.images || room.images.length == 0){
            room.avatar = 'assets/hapinistay-logo-border-white.png';
            room.imageUrls = ['assets/hapinistay-logo-border-white.png'];
        } else {
            room.avatar = room.images[0].secure_url;
            var images: string[] = [];
            room.imageUrls = room.images.map(e => e.secure_url);
        }
    }
}

/**
 * Get room's images
 */
export function getRoomImages(room: IRoom): NgxGalleryImage[]{
    var images: NgxGalleryImage[] = [];
    if(room){
        if(!room.images || room.images.length == 0){
            images = [];
        } else {
            images = room.images.map(e =>  {
                let image : NgxGalleryImage = {
                    small: e.secure_url,
                medium: e.secure_url,
                big: e.secure_url
                }
                return image;
            });
        }
    }
    return images;
}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}