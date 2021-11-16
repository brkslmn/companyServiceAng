import { FragmentType } from "./query";

export class QueryFragment {
    constructor(public type: FragmentType, public value:string) {}  
}