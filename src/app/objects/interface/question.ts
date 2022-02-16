export class Question{
    id:number;
    question:string;
    userResponse?:string;
    responseId?:number;
    result?:string;
    responseType:string;
    eligibleResponses:string[];
}