export interface IPagedResults<T> {
    totalElements: number;
    content: T;
}

export interface IResponseData<T> {
    message: string;
    data: T;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IImage {
    id: number;
    url: string;
    secure_url: string;
}

export interface IRatingForm {
    id: number;
    comment: string,
    rating: number,
    name: string
}

export interface IHouse {
    id?: any;
    nameVi?: string;
    nameEn?: string;
    name?: string;
    descriptionVi?: string;
    descriptionEn?: string;
    description: string;
    address?: IAddress;
    comments? : string[];
    images?:  IImage[];
    avatar?:string;
    displayAddress?: string;
    watch?: boolean;
    policy?: IPolicy;
    facility?: IFacility;
    contact? : IContact;
    minPrice?: number;
    available?: number;
    rooms?: IRoom[];
    imageUrls?: (string | IImage)[];
    status?: string;
    lastUpdate?: Date;
}

export interface IAddress {
    id?: any;
    streetNumber: string;
    streetNameVi?: string;
    streetNameEn?: string;
    streetName: string;
    ward?: string;
    district?: string;
    city?: string;
    province?: string;
    latitude?: number;
    longitude?: number;
    wardName?: string;
    districtName?: string;
    cityName?: string;
}

export interface IPolicy{
    id?: any;
    flexTime?: boolean;
    cookMeal?: boolean;
    packing?: boolean;
    wifi?: boolean;
}

export interface IFacility{
    id?: any;
    electricity?: string;
    water?: string;
    noteEn?: string,
    noteVi?: string,
    note: string;
}

export interface IContact{
    id?: any;
    name? : string;
    email? : string;
    phone? : string;
    avatar? : string;
}

export interface INewHouse {
        name: string;
        description: string;
        streetNumber?: string;
        streetName?: string;
        city?: string;
        district?: string;
        ward?: string;
        latitude?: number;
        longitude?: number;
}

export interface IRoom {
    id?: any;
    name?: string;
    description?: string;
    area?: number;
    maxNumber?: number;
    toilet?: string;
    sex?: string;
    price?: number;
    note?: string;
    avatar?: string;
    images?:  IImage[];
    available?: Boolean;
    toiletName?: string;
    sexName?: string;
    imageUrls?: (string | IImage)[];
    status?: string;
    lastUpdate?: Date;
    level?: number;
}

export interface IAddressSetting {
    id: number,
    code: string,
    name: string,
    type: string,
    cityCode: string,
    districtCode: string,
    wardCode: string,
    description: string
}

export interface IConstant {
    id?: number,
    code?: string,
    name?: string,
    type?: string
}

export interface ISearchTerm {
    name: string,
    description: string,
    districtCode?: string,
    searchTerm?: string,
    roomId?: number
}

export interface Message {
    name: string,
    text: string
}

export interface IQbLogin {
    code: string;
}

export interface Credentials {
    // Customize received credentials here
    username: string;
    token: string;
    refreshToken: string;
    userId: number;
    authority: string;
}
  
export interface LoginContext {
    username: string;
    password: string;
    remember?: boolean;
}

export interface IUser {
    id:number;
	name: string;
    phone: string;
    password:string;
    username: string
}

export interface IUserPassword {
	username: string;
    oldPassword?: string;
    newPassword:string;
    confirmPassword: string;
    phone?: string;
    agree?: boolean;
    code?: string;
}
